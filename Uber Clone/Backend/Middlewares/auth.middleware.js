const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');
const captainModel = require('../models/captain.model');


module.exports.authUser = async (req, res, next) => {
    // Extract token from various possible formats
    let token;
    
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization) {
        // Handle different authorization header formats
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else if (authHeader.includes(' ')) {
            token = authHeader.split(' ')[1];
        } else {
            // If it's just the token without 'Bearer'
            token = authHeader;
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // If using mock data, skip database checks
    if (global.isUsingMockData) {
        try {
            const secret = process.env.JWT_SECRET || 'defaultsecret';
            const decoded = jwt.verify(token, secret);
            
            // Create a mock user for development
            req.user = {
                _id: decoded._id || 'mock-user-id',
                name: 'Mock User',
                email: decoded.email || 'mock@example.com',
                role: 'user'
            };
            
            return next();
        } catch (err) {
            console.log('Token verification error in mock mode:', err.message);
            return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
        }
    }

    // Normal flow with database checks
    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'defaultsecret';
        const decoded = jwt.verify(token, secret);
        const user = await userModel.findById(decoded._id)

        req.user = user;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    // Extract token from various possible formats
    let token;
    
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization) {
        // Handle different authorization header formats
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else if (authHeader.includes(' ')) {
            token = authHeader.split(' ')[1];
        } else {
            // If it's just the token without 'Bearer'
            token = authHeader;
        }
    }

    console.log('Token received:', token);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // If using mock data, skip database checks
    if (global.isUsingMockData) {
        try {
            const secret = process.env.JWT_SECRET || 'defaultsecret';
            const decoded = jwt.verify(token, secret);
            
            // Create a mock captain for development
            req.captain = {
                _id: decoded._id || 'mock-captain-id',
                name: 'Mock Captain',
                email: decoded.email || 'mockcaptain@example.com',
                role: 'captain'
            };
            
            return next();
        } catch (err) {
            console.log('Token verification error in mock mode:', err.message);
            return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
        }
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    console.log('Is token blacklisted:', isBlacklisted);

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'defaultsecret';
        const decoded = jwt.verify(token, secret);
        const captain = await captainModel.findById(decoded._id)
        req.captain = captain;

        return next()
    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'Unauthorized' });
    }
}