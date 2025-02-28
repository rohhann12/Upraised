const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { errorResponse } = require('../utils/responseHandler');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(errorResponse('Authentication required'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(errorResponse('Invalid or expired token'));
    }
};

const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(errorResponse('Authentication required'));
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json(errorResponse('Insufficient permissions'));
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize
};