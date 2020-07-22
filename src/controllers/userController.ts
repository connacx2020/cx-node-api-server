const { pool } = require('../utils/dbClient');

exports.testdb = (req: any, res: any) => {
    pool.query('SELECT * FROM ts_kv;', (error: any, results: any) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
}

exports.getUsers = function (req: any, res: any) {
    res.json({
        status: "success",
        message: "Sample user",
        data: {
            name: "Sample"
        }
    });
}


