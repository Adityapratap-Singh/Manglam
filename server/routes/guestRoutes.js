const express = require("express");
const {
  createGuest,
  getAllGuests,
  deleteGuest,
  editGuest,
  getGuestData
} = require("../controllers/guestController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes - requires login
router.post("/guest", isAuthenticated, createGuest);
router.get("/guests", isAuthenticated, getAllGuests);
router.put("/guest/:id", isAuthenticated, editGuest);
router.delete("/guest/:id", isAuthenticated, deleteGuest);

// Public routes - no login required
router.get("/guest/:inviteId", getGuestData);

module.exports = router;
