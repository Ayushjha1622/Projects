const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodPartner.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// user registration, login, logout

async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token);
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }   
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        
    );

    res.cookie('token', token);
    res.status(200).json({
        message: 'Login successful',
        user: { 
            _id: user._id,
            email: user.email,  
            fullName: user.fullName
        }
    });


}

async function logoutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

//  Food Partner registration, login, logout

async function registerFoodPartner(req, res) {
    try {
        const { name, email, password, phone, address, contactName } = req.body;

        const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
        if (isAccountAlreadyExists) {
            return res.status(400).json({ message: 'Food Partner already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            contactName
        });

        const token = jwt.sign(
            { id: foodPartner._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({
            message: 'Food Partner registered successfully',
            foodPartner: {
                _id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                address: foodPartner.address,
                phone: foodPartner.phone,
                contactName: foodPartner.contactName
            }
        });

    }catch (error) {
    console.error('REGISTER FOOD PARTNER ERROR:', error);
    res.status(500).json({
        message: 'Server error',
        error: error.message
    });
}
}

async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        const foodPartner = await foodPartnerModel.findOne({ email });
        if (!foodPartner) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: foodPartner._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({
            message: 'Login successful',
            foodPartner: {
                _id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email
            }
        });

    } catch (error) {
    console.error('REGISTER FOOD PARTNER ERROR:', error);
    res.status(500).json({
        message: 'Server error',
        error: error.message
    });
}
}

async function logoutFoodPartner(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}








module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};
