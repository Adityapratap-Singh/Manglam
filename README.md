# 🪔 Manglam - Digital Wedding Invitation Platform

A modern, elegant digital wedding invitation platform built with Node.js, Express, and MongoDB. Create, manage, and send beautiful digital wedding invitations with real-time tracking.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

---

## ✨ Features

### 🎯 Core Functionality
- **Admin Dashboard**: Secure login-protected dashboard for managing guests
- **Guest Management**: Add, edit, and delete guest entries
- **Unique Invite Links**: Generate unique invitation links for each guest
- **Invitation Tracking**: Track which guests have opened their invitations
- **Family Support**: Mark guests as attending with family members
- **Beautiful UI**: Elegant, responsive invitation design with Hindi language support

### 🔒 Security Features
- Session-based authentication with bcryptjs password hashing
- Protected API endpoints requiring admin login
- CSRF protection through Express-session
- Secure credential storage using environment variables

### 📱 User Interface
- Modern admin panel with Material Design principles
- Beautiful wedding invitation card with animations
- Responsive design for mobile and desktop
- Floating WhatsApp button for quick contact
- Music toggle on invitation page

### 📊 Tracking & Analytics
- Real-time guest list with status (Opened/Not Opened)
- Automatic timestamp tracking for each guest
- Quick-copy invitation links
- Guest attendance confirmation with family status

---

## 🏗️ Project Structure (MVC Architecture)

```
wedding-platform/
├── server/
│   ├── models/
│   │   └── Guest.js              # MongoDB Guest schema
│   ├── views/
│   │   ├── admin.html            # Admin dashboard
│   │   ├── invite.html           # Wedding invitation template
│   │   └── login.html            # Login page
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── guestController.js    # Guest CRUD operations
│   │   └── pageController.js     # Page rendering logic
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── guestRoutes.js        # Guest API routes
│   │   └── pageRoutes.js         # Page routes
│   ├── middleware/
│   │   └── authMiddleware.js     # Authentication middleware
│   ├── public/
│   │   ├── admin.css             # Admin panel styles
│   │   ├── admin.js              # Admin panel functionality
│   │   ├── login.css             # Login page styles
│   │   └── login.js              # Login functionality
│   ├── server.js                 # Express server entry point
│   ├── .env                      # Environment configuration
│   └── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (free tier available)

### Step 1: Clone/Download the Project
```bash
cd wedding-platform/server
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `express-session` - Session management
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `uuid` - Unique ID generation

### Step 3: Configure Environment Variables

Create or update `.env` file in the `server/` directory:

```env
# MongoDB Connection
MONGO_URL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?appName=YOUR_APP_NAME

# Admin Credentials
ADMIN_USER=your_username
ADMIN_PASS=your_password

# Session Secret
SESSION_SECRET=your_secret_key_here
```

**Getting MongoDB Connection String:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get the connection string from "Connect" button
4. Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and cluster name

### Step 4: Start the Server

**Development Mode (with auto-reload):**
```bash
npx nodemon server.js
```

**Production Mode:**
```bash
node server.js
```

Server will run on: `http://localhost:5000`

---

## 📖 Usage Guide

### 🔐 Logging In
1. Navigate to `http://localhost:5000`
2. You'll be redirected to login page
3. Enter your credentials (configured in `.env`)
4. Click "Login" to access the admin dashboard

### ➕ Adding Guests
1. In admin dashboard, enter guest's full name
2. Toggle "Invite with Family" if they're bringing family members
3. Click "Add Guest"
4. System generates unique invite link and 8-character ID

### ✏️ Editing Guest Information
1. Find the guest in the list
2. Click the green "Edit" button
3. Update the guest's name
4. Confirm family member inclusion
5. Changes are saved instantly

### 🗑️ Deleting Guests
1. Click "Delete" button next to the guest
2. Confirm deletion
3. Guest is immediately removed from the list

### 📋 Managing Invitations
- **Copy Link**: Click to copy the invitation link to clipboard
- **Track Status**: See which guests have opened their invitations (Opened/Not Opened)
- **Family Icon**: 👨‍👩‍👧‍👦 indicates guests attending with family

### 👥 Guest Opening Invitation
1. Share the unique invitation link with the guest
2. When guest opens the link, the status changes to "Opened"
3. Guest name and family status are displayed personalized on invitation
4. Guest can click invitation card to reveal details
5. Background music plays automatically

### 📞 Contact Options
- **WhatsApp**: Click the floating WhatsApp button or link in invitation
- **Email**: Direct email contact link provided
- **Phone**: Contact information in footer

---

## 🔌 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/login` | Login with credentials | ❌ No |
| POST | `/api/logout` | Logout and destroy session | ✅ Yes |

### Guest Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/guest` | Create new guest | ✅ Yes |
| GET | `/api/guests` | Get all guests | ✅ Yes |
| PUT | `/api/guest/:id` | Edit guest details | ✅ Yes |
| DELETE | `/api/guest/:id` | Delete guest | ✅ Yes |
| GET | `/api/guest/:inviteId` | Get guest data (public) | ❌ No |

### Page Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/` | Redirect to login | ❌ No |
| GET | `/login` | Login page | ❌ No |
| GET | `/admin` | Admin dashboard | ✅ Yes |
| GET | `/invite/:inviteId` | Guest invitation page | ❌ No |

---

## 💾 Database Schema

### Guest Model
```javascript
{
  _id: ObjectId,
  name: String,              // Guest's full name
  inviteId: String,          // Unique 8-character code
  withFamily: Boolean,       // Family attendance flag
  opened: Boolean,           // Invitation opened status
  createdAt: Date           // Creation timestamp
}
```

---

## 🔐 Authentication Flow

```
User Access
    ↓
[Root /] → Redirect to /login
    ↓
[/login] → Display login form
    ↓
User enters credentials
    ↓
[POST /api/login] → Verify credentials
    ↓
Valid? → Create session → Redirect to /admin
    ↓
Invalid? → Show error message
    ↓
[/admin] → Check session → Display dashboard
    ↓
No session? → Redirect to /login
```

---

## 🛠️ Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web server framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Express-session**: Session management
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **UUID**: Unique ID generation

### Frontend
- **HTML5**: Structure
- **CSS3**: Styling with animations
- **Vanilla JavaScript**: Interactivity
- **Responsive Design**: Mobile-friendly

### Tools & Services
- **MongoDB Atlas**: Cloud database hosting
- **WhatsApp API**: Contact integration
- **Cloudinary**: Media hosting (background images, music)

---

## 📝 Environment Variables

```env
# MongoDB Connection URL
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=app

# Admin Login Credentials
ADMIN_USER=manglam
ADMIN_PASS=shadi2026

# Session Secret (for session encryption)
SESSION_SECRET=manglam_secret_key
```

---

## 🚨 Common Issues & Solutions

### Issue: Cannot connect to MongoDB
**Solution**: 
- Check MONGO_URL in `.env` is correct
- Verify MongoDB Atlas cluster is active
- Check network access in MongoDB Atlas (IP whitelist)

### Issue: "Module not found" errors
**Solution**: 
```bash
npm install
npm install express mongoose express-session bcryptjs cors uuid dotenv
```

### Issue: Session expires too quickly
**Solution**: Modify session configuration in `server.js`

### Issue: WhatsApp link not working
**Solution**: Ensure phone number includes country code (+91 for India)

---

## 📱 Contact & Support

**Manglam Team**
- 📞 Phone: +91 7355259901
- 📧 Email: adityaprataps406@gmail.com
- 💬 WhatsApp: [Contact on WhatsApp](https://wa.me/917355259901)

---

## 📄 File Descriptions

### Core Files
- **server.js**: Main Express application entry point
- **.env**: Environment configuration (gitignore this!)
- **package.json**: Project dependencies and metadata

### Models
- **models/Guest.js**: MongoDB schema for guest data

### Controllers
- **authController.js**: Login/logout business logic
- **guestController.js**: Guest CRUD operations
- **pageController.js**: Page serving logic

### Routes
- **authRoutes.js**: `/api/login`, `/api/logout` endpoints
- **guestRoutes.js**: Guest management API endpoints
- **pageRoutes.js**: Page routes (`/admin`, `/invite/:id`)

### Middleware
- **authMiddleware.js**: Authentication verification middleware

### Views
- **views/login.html**: Admin login page
- **views/admin.html**: Guest management dashboard
- **views/invite.html**: Beautiful wedding invitation card

### Public Assets
- **public/admin.css**: Admin panel styling
- **public/admin.js**: Admin dashboard functionality
- **public/login.css**: Login page styling
- **public/login.js**: Login form handling

---

## 🎨 Customization

### Changing Wedding Details
Edit `/server/views/invite.html`:
- Update bride/groom names
- Modify event dates and venues
- Change colors and styling
- Update contact information

### Changing Admin Credentials
Update `.env` file:
```env
ADMIN_USER=your_username
ADMIN_PASS=your_password
```

### Changing Colors & Theme
Edit CSS files:
- Gold color: `#ffd700` or `gold`
- Dark red: `#2b0000` or `#7a0000`
- Modify in `.html` style tags or `.css` files

---

## 🚀 Deployment

### Deploying to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URL=your_mongodb_url
heroku config:set ADMIN_USER=your_username
heroku config:set ADMIN_PASS=your_password
heroku config:set SESSION_SECRET=your_secret

# Deploy
git push heroku main
```

### Other Hosting Options
- **Render.com**: Free tier Node.js hosting
- **Railway.app**: Easy deployment
- **AWS**: EC2 with custom domain
- **DigitalOcean**: Droplets and App Platform

---

## 📋 Checklist for Production

- [ ] Update MongoDB Atlas IP whitelist
- [ ] Change default admin credentials
- [ ] Set secure SESSION_SECRET
- [ ] Update contact information (WhatsApp, email)
- [ ] Customize wedding details in invite.html
- [ ] Test all endpoints with real data
- [ ] Set `secure: true` in cookie for HTTPS
- [ ] Enable HTTPS on your domain
- [ ] Set up email notifications (optional)
- [ ] Create backup of MongoDB

---

## 📜 License

ISC License - Feel free to use this project for your wedding!

---

## 🙏 Credits

Built with ❤️ for celebrating love and togetherness.

Manglam - Making weddings digital, personal, and memorable.

---

## 🎯 Future Enhancements

- [ ] Email notifications for guest RSVPs
- [ ] Guest response/RSVP system
- [ ] Multiple event support (Mehendi, Sangeet, etc.)
- [ ] Attendance statistics and analytics
- [ ] Custom theme builder
- [ ] SMS integration
- [ ] Payment integration for invitation customization
- [ ] Social media sharing
- [ ] Guest photo gallery
- [ ] Wedding website integration

---

## ❓ FAQ

**Q: Can I use this for non-wedding events?**
A: Yes! You can customize it for any celebration (birthday, anniversary, party, etc.)

**Q: How do I backup my guest data?**
A: Use MongoDB Atlas backup feature or export data through compass.

**Q: Can multiple people manage guests?**
A: Currently single admin account. Multi-user support coming soon!

**Q: Is the invitation link secure?**
A: Yes, links use unique 8-character IDs making them difficult to guess.

**Q: Can guests RSVP through the invitation?**
A: Coming in future versions. Currently view-only for tracking opens.

---

**Last Updated**: January 14, 2026
**Version**: 1.0.0
