const { JWT_SECRET } = require("../utils/config");

const JWT_SECRET = "my-super-secret-key";

if (!user) {
  return res.status(401).json({ message: "Invalid email or password" });
}

res.status(200).json({
  message: "Login successful",
  token: token,
});

module.exports = { JWT_SECRET };
