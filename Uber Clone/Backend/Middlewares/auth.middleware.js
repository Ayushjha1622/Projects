const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model"); // ✅ Import captain model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BlacklistTokenModel = require("../models/BlacklistToken.model");

// 🔹 Auth Middleware for Users
module.exports.authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided" });
    }

    const isBlacklisted = await BlacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized access. Token is blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access. User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized access. Invalid token" });
  }
};

// 🔹 Auth Middleware for Captains
module.exports.authCaptain = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided" });
    }

    const isBlacklisted = await BlacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized access. Token is blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized access. Captain not found" });
    }

    req.captain = captain;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized access. Invalid token" });
  }
};
