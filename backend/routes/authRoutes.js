const AuthController = require("../controllers/authController");
const jwt = require("jsonwebtoken");
const db = require("../models");
const rateLimiter = require("../middleware/rateLimitMiddleware");

module.exports = (app) => {
  app.post("/signup", rateLimiter, AuthController.signup);
  app.post("/login", rateLimiter, AuthController.login);
  app.post("/verify-username", rateLimiter, AuthController.verifyUsername);
  app.post("/reset-password", rateLimiter, AuthController.resetPassword);
  app.post("/verify-email", rateLimiter, AuthController.verifyEmail);
  app.post("/token", rateLimiter, async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);

    const user = await db.users.findOne({ where: { refreshToken: token } });
    if (!user) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // Token is not valid

      const { accessToken, refreshToken } = AuthController.createTokens(user);
      user.refreshToken = refreshToken;
      user.save();

      res.json({ accessToken, refreshToken });
    });
  });
};
