"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dbClient_1 = require("../utils/dbClient");
const { encrypt, decrypt } = require('../utils/crypto');
const { signUser, validateToken } = require('../utils/jwt');
exports.validateToken = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        res.status(400).json({
            status: 400,
            message: 'Token invalid!'
        }).end();
    }
    const result = yield validateToken(token);
    if (result && result !== null) {
        res.status(200).json({
            status: 200,
            message: "Token valid!",
            result
        });
    }
    else {
        res.status(400).json({
            status: 400,
            message: 'Token expired!'
        });
    }
});
exports.login = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            status: 400,
            message: 'Invalid username or password!'
        }).end();
    }
    const client = yield dbClient_1.default.connect();
    try {
        const result = yield client.query('SELECT * FROM users WHERE username=$1;', [username]);
        if (result && result.rows.length === 0) {
            res.status(400).json({
                status: 400,
                message: 'User not found!'
            }).end();
        }
        else {
            const currentPassword = result.rows[0].password;
            const decrypted = yield decrypt(currentPassword);
            if (password === decrypted) {
                const jwtToken = signUser(result.rows[0].id);
                res.status(200).json({
                    status: 200,
                    message: "Login Successful!",
                    token: jwtToken.token
                }).end();
            }
            else {
                res.status(400).json({
                    status: 400,
                    message: "Password mismatch!"
                }).end();
            }
        }
    }
    finally {
        yield client.release();
    }
});
exports.register = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { username, password, name, client } = req.body;
    var encryptedPassword = encrypt(password);
    dbClient_1.default.query(`INSERT INTO users (username, password, name, client) VALUES($1, $2, $3, $4)`, [username, encryptedPassword, name, client], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json({
            status: 200,
            message: 'User Registration Successful!',
            data: {
                username: username,
                name: name
            }
        }).end();
    });
});
