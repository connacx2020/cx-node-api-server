import pool from '../utils/dbClient';

exports.getPatronasData = (req: any, res: any) => {
    const deviceID = "f62241e0-edc2-11ea-a72f-7398ea06dc89";
    const { date } = req.query;

    const datetime1 = `${date} 07:00:00`;
    const datetime2 = `${date} 22:00:00`;
    pool.query(
        `
        SELECT *
        FROM 
        (select entity_id, key, long_v, json_v, ts,
        TO_TIMESTAMP(TRUNC(ts/1000)) + INTERVAL '8 hour' as datetime
        from ts_kv 
        where entity_id=$1) AS expr_qry
        WHERE datetime >= $2
        AND datetime <= $3
        ORDER BY ts;
        `, [deviceID, datetime1, datetime2], (error: any, results: any) => {
        if (error) {
            throw error;
        }
        const data = results.rows;
        console.log(data);
        const returnData: any = [];
        data.forEach((res: any) => {
            switch (res.key) {
                case 7: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "count",
                        data: res.long_v,
                        ts: res.ts
                    });
                    break;
                }
                case 8: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump1_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 9: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump2_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 10: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump3_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 11: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump4_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 12: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump5_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 13: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump6_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 14: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump1",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
            }
        });
        res.status(200).json({
            status: 200,
            message: 'Successful!',
            data: returnData
        }).end();
    });
}
