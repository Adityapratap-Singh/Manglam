const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

/* Helmet middleware for security headers */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      mediaSrc: ["'self'", "https:"],
      connectSrc: ["'self'", "https:", "http:"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: "deny", // Prevent clickjacking
  },
  noSniff: true, // Prevent MIME type sniffing
  xssFilter: true, // Enable XSS filter
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

/* Rate limiting for login endpoint */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
});

/* General API rate limiting */
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per IP
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

/* Strict rate limiting for guest lookup */
const guestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: "Too many requests to guest lookup",
  skipSuccessfulRequests: false,
});

/* Custom data sanitization middleware for Express 5.x compatibility */
const sanitizeData = (req, res, next) => {
  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize params
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

/* Helper function to sanitize objects */
function sanitizeObject(obj) {
  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        // Remove $ signs and other NoSQL injection characters
        sanitized[key] = value.replace(/[\$\{\}]/g, '');
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
}

/* Custom middleware to prevent NoSQL injection */
const validateInput = (req, res, next) => {
  // Check for suspicious patterns in query parameters
  const suspiciousPatterns = [/\$/, /\{/, /\}/];
  
  for (let key in req.query) {
    const value = req.query[key];
    if (typeof value === "string") {
      if (suspiciousPatterns.some(pattern => pattern.test(value))) {
        return res.status(400).json({ error: "Invalid input detected" });
      }
    }
  }
  next();
};

/* CORS configuration */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from the same origin and specific domains
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000",
      process.env.ALLOWED_ORIGIN || "http://localhost:5000",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/* Security middleware for session */
const secureSession = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    httpOnly: true, // Prevent client-side JS from accessing the cookie
    sameSite: "strict", // CSRF protection
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
};

/* Middleware to add security headers */
const addSecurityHeaders = (req, res, next) => {
  // Prevent information disclosure
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Remove sensitive headers
  res.removeHeader("X-Powered-By");
  
  next();
};

/* Middleware to validate JSON payload size */
const limitPayloadSize = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (req.get("Content-Length") > maxSize) {
    return res.status(413).json({ error: "Payload too large" });
  }
  next();
};

module.exports = {
  securityHeaders,
  loginLimiter,
  apiLimiter,
  guestLimiter,
  sanitizeData,
  validateInput,
  corsOptions,
  secureSession,
  addSecurityHeaders,
  limitPayloadSize,
};
