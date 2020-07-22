import pool from '../utils/dbClient';

exports.mag = (req: any, res: any) => {
    res.status(200).json({
        status: 'successful',
        message: 'mag controller'
    });
}

exports.testdb = (req: any, res: any) => {
    pool.query('SELECT * FROM ts_kv;', (error: any, results: any) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
}

