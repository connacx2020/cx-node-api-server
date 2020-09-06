import pool from '../utils/dbClient';

exports.getPatronasData = (req: any, res: any) => {
    const deviceID = "f62241e0-edc2-11ea-a72f-7398ea06dc89";
    pool.query(
        `select * from ts_kv where entity_id=$1 order by key;`, [deviceID], (error: any, results: any) => {
        if (error) {
            throw error;
        }
        res.status(200).json({
            status: 200,
            message: 'Successful!',
            data: results.rows
        }).end();
    });
}
