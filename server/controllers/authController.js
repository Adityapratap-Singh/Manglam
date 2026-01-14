const bcrypt = require("bcryptjs");

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = bcrypt.hashSync(process.env.ADMIN_PASS, 10);

const login = async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = bcrypt.compareSync(password, ADMIN_PASS);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session.admin = true;
  res.json({ success: true });
};

const logout = (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
};

module.exports = { login, logout };
