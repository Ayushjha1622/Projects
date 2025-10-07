const express = require("express")
const router = express.Router()
const {body} = require('express-validator')
const rideController = require('../Controllers/ride.controller')
const authMiddleware = require('../Middlewares/auth.middleware')





router.post('/create',
    authMiddleware.authUser,
    
    body('pickup').isString().isLength({min: 3}).withMessage('Invalid pickup address'),

    body('destination').isString().isLength({min: 3}).withMessage('Invalid destination address'),

    body('vehicleType').isString().isIn(['auto','car','moto']).withMessage('Invalid vehicleType'),

    rideController.createRide

)

module.exports = router;