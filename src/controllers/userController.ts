import pool from '../utils/dbClient';
const { encrypt, decrypt } = require('../utils/crypto');
const { signUser, validateToken } = require('../utils/jwt');

exports.validateToken = async (req:any, res:any) => {
    const {token} = req.body;
    if(!token) {
        res.status(400).json({
            status: 400,
            message: 'Token invalid!'
        }).end();
    }
    const result = await validateToken(token);
    if(result && result!==null){
        res.status(200).json({
            status: 200,
            message:"Token valid!",
            result
        });
    } else {
        res.status(400).json({
            status: 400,
            message: 'Token expired!'
        });
    }
}

exports.login = async (req: any, res: any) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            status: 400,
            message: 'Invalid username or password!'
        }).end();
    }
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE username=$1;', [username]);
        if (result && result.rows.length === 0) {
            res.status(400).json({
                status: 400,
                message: 'User not found!'
            }).end();
        } else {
            const currentPassword = result.rows[0].password;
            const decrypted = await decrypt(currentPassword);
            if (password === decrypted) {
                const jwtToken = signUser(result.rows[0].id);
                res.status(200).json({
                    status: 200,
                    message: "Login Successful!",
                    token: jwtToken.token
                }).end();
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Password mismatch!"
                }).end();
            }
        }
    } finally {
        await client.release();
    }
}

exports.register = async (req: any, res: any) => {
    const { username, password, name, client } = req.body;
    var encryptedPassword = encrypt(password);
    pool.query(`INSERT INTO users (username, password, name, client) VALUES($1, $2, $3, $4)`, [username, encryptedPassword, name, client], (error: any, results: any) => {
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
}
