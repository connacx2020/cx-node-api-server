import pool from '../utils/dbClient';
const { encrypt } = require('../utils/crypto');
exports.testdb = (req: any, res: any) => {
    pool.query('SELECT * FROM ts_kv;', (error: any, results: any) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
}

exports.register = (req: any, res: any) => {
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
        })
    });
}


