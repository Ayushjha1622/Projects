const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const captainController = require("../Controllers/captain.controller");
const authmiddleware = require("../Middlewares/auth.middleware");


router.post("/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname").isLength({ min: 3 })
        .withMessage("first name must be at least 3 characters long"),
    body("password").isLength({ min: 6}).withMessage("password must be 5 characters long"),
    body("vehicle.color").isLength({ min: 3 }).withMessage("Vehicle color must be at least 3 characters long"),
    body("vehicle.plate").isLength({ min: 3 }).withMessage("Vehicle plate must be at least 3 characters long"),
    body("vehicle.capacity").isInt({ min: 1 }).withMessage("Vehicle capacity must be at least 1"),  
    body("vehicle.vehicleType").isIn(["car", "bike", "auto"]).withMessage("Invalid vehicle type"),
  ],
  captainController.registerCaptain
);
  

router.post("/login",[
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be 5 characters long"),
], 
captainController.loginCaptain)

router.get("/profile",authmiddleware.authCaptain,captainController.getCaptainProfile );


router.get("/logout",authmiddleware.authCaptain, captainController.logoutCaptain );

module.exports = router;