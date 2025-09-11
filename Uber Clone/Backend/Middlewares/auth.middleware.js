const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Also fixed typo

module.exports.authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided" });
    }

    const isBlacklisted = await userModel.findOne({token: token});

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
