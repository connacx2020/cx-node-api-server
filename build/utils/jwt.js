"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = exports.validateToken = void 0;
const jwt = require('jsonwebtoken');
const jwtKey = "my_secret_key_aatozz";
exports.signUser = (userID) => {
    const jwtExpirySeconds = 3600;
    const jwtExpiryTime = new Date(new Date().getTime() + jwtExpirySeconds * 1000).getTime();
    const token = jwt.sign({ userID, jwtExpiryTime }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    });
    return {
        token,
        jwtExpirySeconds
    };
};
exports.validateToken = (token) => {
    var payload;
    try {
        payload = jwt.verify(token, jwtKey);
    }
    catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            console.log('Error:', e);
            return null;
        }
    }
    const currentTime = new Date();
    const tokenExpiryTime = payload.jwtExpiryTime;
    if (tokenExpiryTime - currentTime.getTime() > 0) {
        return payload;
    }
    return null;
};
exports.authenticateJWT = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(" ", 2);
    var validate = '';
    if (token.length === 2) {
        validate = exports.validateToken(token[1]);
    }
    if (validate && validate != null) {
        next();
    }
    else {
        res.status(400).json({
            status: 400,
            message: 'token expired!'
        }).end();
    }
};
