const path = require("path");

const getAdminPage = (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/login.html");
  }
  res.sendFile(path.join(__dirname, "../views", "admin.html"));
};

module.exports = { getAdminPage };
