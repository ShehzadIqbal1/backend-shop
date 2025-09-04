const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../utils/validators');
const signToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn:
            process.env.JWT_EXPIRES_IN || '7d'
    });
};
exports.register = async (req, res, next) => {
    try {
        const parsed = registerSchema.parse(req.body);
        const exists = await User.findOne({ email: parsed.email });
        if (exists) return res.status(400).json({ message: 'Email already in use' });
        const user = await User.create(parsed);
        const token = signToken(user);
        res.status(201).json({
            token, user: {
                id: user._id, email: user.email,
                name: user.name, role: user.role
            }
        });
    } catch (err) {
        if (err.name === 'ZodError') return res.status(400).json({
            message:
                err.errors
        });
        next(err);
    }
};
exports.login = async (req, res, next) => {
    try {
        const parsed = loginSchema.parse(req.body);
        const user = await User.findOne({ email: parsed.email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const match = await user.comparePassword(parsed.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });
        const token = signToken(user);
        res.json({
            token, user: {
                id: user._id, email: user.email, name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        if (err.name === 'ZodError') return res.status(400).json({
            message:
                err.errors
        });
        next(err);
    }
};
