const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const { successResponse, errorResponse } = require('../utils/responses');

const prisma = new PrismaClient();

class authController {
    register = async (req, res) => {
        try {
            const { username, password, role } = req.body;

            if (!username || !password) {
                return res.status(400).json(
                    errorResponse('Username and password are required')
                );
            }

            const existingUser = await prisma.user.findUnique({
                where: { username },
            });

            if (existingUser) {
                return res.status(409).json(
                    errorResponse('Username already exists')
                );
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    role: role || 'agent',
                },
            });

            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;

            return res.status(201).json(
                successResponse('User registered successfully', userWithoutPassword)
            );
        } catch (error) {
            return res.status(500).json(
                errorResponse('Failed to register user', error)
            );
        }
    };

    login = async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json(
                    errorResponse('Username and password are required')
                );
            }
            const user = await prisma.user.findUnique({
                where: { username },
            });

            if (!user) {
                return res.status(401).json(
                    errorResponse('Invalid credentials')
                );
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json(
                    errorResponse('Invalid credentials')
                );
            }
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            return res.status(200).json(
                successResponse('Login successful', { token })
            );
        } catch (error) {
            return res.status(500).json(
                errorResponse('Failed to login', error)
            );
        }
    };
}

module.exports = {
    authController
};