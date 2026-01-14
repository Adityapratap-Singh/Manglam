const express = require("express");
const { getAdminPage } = require("../controllers/pageController");
const { getInvitePage } = require("../controllers/guestController");

const router = express.Router();

router.get("/admin", getAdminPage);
router.get("/invite/:inviteId", getInvitePage);

module.exports = router;
