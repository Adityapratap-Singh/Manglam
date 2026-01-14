const isAuthenticated = (req, res, next) => {
  if (!req.session.admin) {
    return res.status(401).json({ error: "Unauthorized - Please login first" });
  }
  next();
};

module.exports = { isAuthenticated };
