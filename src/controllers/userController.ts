import pool from '../utils/dbClient';
const { encrypt, decrypt } = require('../utils/crypto');
const { signUser } = require('../utils/jwt');

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
                console.log("password match!");

                const jwtToken = signUser(username);
                const tokenExpiryTime = new Date().getTime();
                //  + jwtToken.jwtExpirySeconds * 1000;
                const updateToken = client.query(`UPDATE users SET token=$1, tokenExpiryTime=$2 WHERE username=$3`, [jwtToken.token, tokenExpiryTime, username]);
                console.log("UpdateToken:", updateToken);

                res.cookie("token", jwtToken.token, { maxAge: jwtToken.jwtExpirySeconds * 1000 });
                res.status(200).json({
                    status: 200,
                    message: "Login Successful!",
                    token: jwtToken.token
                }).end();
            } else {
                res.status(200).json({
                    status: 200,
                    message: "Password dismatch!"
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
        });
    });
}
