const foodPartnerModel = require('../models/foodPartner.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');



async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token || '';
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) {
            return res.status(401).json({ message: 'Unauthorized: Food Partner not found' });
        }
        req.foodPartner = foodPartner;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }


}

async function authUserMiddleware(req, res, next) {

    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    
}



module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
};