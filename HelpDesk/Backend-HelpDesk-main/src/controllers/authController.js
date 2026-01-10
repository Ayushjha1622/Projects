import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        error: {
          code: 'FIELD_REQUIRED',
          field: 'email',
          message: 'Email is required'
        }
      });
    }

    if (!password) {
      return res.status(400).json({
        error: {
          code: 'FIELD_REQUIRED',
          field: 'password',
          message: 'Password is required'
        }
      });
    }

    if (!name) {
      return res.status(400).json({
        error: {
          code: 'FIELD_REQUIRED',
          field: 'name',
          message: 'Name is required'
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 'DUPLICATE_ENTRY',
          field: 'email',
          message: 'Email already exists'
        }
      });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role: role || 'user'
    });

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        error: {
          code: 'FIELD_REQUIRED',
          field: 'email',
          message: 'Email is required'
        }
      });
    }

    if (!password) {
      return res.status(400).json({
        error: {
          code: 'FIELD_REQUIRED',
          field: 'password',
          message: 'Password is required'
        }
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'Account has been disabled'
        }
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    res.json({
      user: req.user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};