const { errorResponse } = require('../utils/responseHandler');
const { Prisma } = require('@prisma/client');

const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Handle Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return res.status(409).json(
                    errorResponse('A resource with that unique identifier already exists', err)
                );
            case 'P2025':
                return res.status(404).json(
                    errorResponse('Record not found', err)
                );
            default:
                return res.status(500).json(
                    errorResponse('Database error occurred', err)
                );
        }
    }

    // Handle other errors
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json(errorResponse('Unauthorized access', err));
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json(errorResponse('Validation error', err));
    }

    // Default error handling
    return res.status(500).json(
        errorResponse('Internal server error', process.env.NODE_ENV === 'development' ? err : undefined)
    );
};

module.exports = errorHandler;
