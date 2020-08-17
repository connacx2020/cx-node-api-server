"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { decrypt } = require('../utils/crypto');
const { signUser, validateToken } = require('../utils/jwt');
const auth = require('../utils/auth.json');
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, client } = req.body;
    if (!username || !password || !client) {
        res.status(400).json({
            status: 400,
            message: 'Invalid inputs!'
        }).end();
    }
    var authData = '';
    auth.map((res) => {
        if (res.client === client) {
            authData = res;
        }
    });
    if (!authData && authData.client !== client) {
        res.status(400).json({
            status: 400,
            message: 'Invalid client!'
        }).end();
    }
    else if (username !== authData.username) {
        res.status(400).json({
            status: 400,
            message: 'User not found!'
        }).end();
    }
    else {
        const decrypted = yield decrypt(authData.password);
        if (password === decrypted) {
            const jwtToken = signUser(authData.id);
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
});
