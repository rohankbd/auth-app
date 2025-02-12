const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = db.users;

const createTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id }, process.env.SECRET, {
    expiresIn: "86400", // 24 hours
  });
  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

module.exports = {
  signup: async (req, res) => {
    // Input validation
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({ message: "All fields are required." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Invalid email format." });
    }

    // Password strength check (basic example)
    if (password.length < 6) {
      return res
        .status(400)
        .send({ message: "Password must be at least 6 characters long." });
    }

    try {
      // Check for existing user
      const oldUser = await User.findOne({ where: { username } });
      if (oldUser) {
        return res.status(409).send({ message: "Username already in use." });
      }

      const oldEmail = await User.findOne({ where: { email } });
      if (oldEmail) {
        return res.status(409).send({ message: "Email already in use." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      // Create token
      const { accessToken, refreshToken } = createTokens(user);

      user.refreshToken = refreshToken;
      await user.save();

      // Return success message and JWT token
      res.status(201).send({
        message: "User registered successfully!",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  login: async (req, res) => {
    // Input validation
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .send({ message: "Username and password are required." });
    }

    try {
      // Check for existing user
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      // Compare password
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid password." });
      }

      // Create token
      const { accessToken, refreshToken } = createTokens(user);

      user.refreshToken = refreshToken;
      await user.save();

      // Return success message and JWT token
      res.status(200).send({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  verifyUsername: async (req, res) => {
    const { username } = req.body;
    try {
      const user = await db.users.findOne({ where: { username } });
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      if (user) {
        res.send({ verified: true });
      } else {
        res.send({ verified: false });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    const { username, newPassword } = req.body;

    try {
      const user = await db.users.findOne({ where: { username } });
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.send({ message: "Password reset successfully." });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    const { username, email } = req.body;
    try {
      const user = await db.users.findOne({ where: { username } });
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      if (user.email === email) {
        res.send({ verified: true });
      } else {
        res.send({ verified: false });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  createTokens: createTokens,
};
