const foodPartnerModel = require('../models/foodPartner.model');
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


module.exports = {
    authFoodPartnerMiddleware
};