import pool from '../utils/dbClient';
import { config } from '../utils/config';

exports.getPPCByDateRange = (req: any, res: any) => {
    const { door, date1, date2 } = req.query;
    var doorType = '';
    switch (door) {
        case 'all': doorType = " != '0'"; break
        case 'east': doorType = " = 'East'"; break;
        case 'west': doorType = " = 'West'"; break;
        case 'circle': doorType = " = 'Circle'"; break;
        case 'b2': doorType = " = 'B2'"; break;
        default: doorType = " != '0'"; break;
    }
    const dateTime1 = `${date1} 00:00:00`
    const dateTime2 = `${date2} 23:59:59`
    const query = getQuery(doorType);
    pool.query(query, [dateTime1, dateTime2], (error: any, results: any) => {
        if (error) {
            throw error;
        }
        console.log(results);
        res.status(200).json({
            status: 200,
            message: 'Successful!',
            data: results.rows
        }).end();
    });
}

exports.getPPCByTimeRange = (req: any, res: any) => {
    const { door, date, time1, time2 } = req.query;
    var doorType = '';
    switch (door) {
        case 'all': doorType = " != '0'"; break
        case 'east': doorType = " = 'East'"; break;
        case 'west': doorType = " = 'West'"; break;
        case 'circle': doorType = " = 'Circle'"; break;
        case 'b2': doorType = " = 'B2'"; break;
        default: doorType = " != '0'"; break;
    }
    const dateTime1 = `${date} ${time1}`
    const dateTime2 = `${date} ${time2}`
    const query = getQuery(doorType);
    pool.query(query, [dateTime1, dateTime2], (error: any, results: any) => {
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

const getQuery = (doorType: string) => {
    return `SELECT CASE
    WHEN door = '${config.deviceIDs.east}' THEN 'East'
    WHEN door = '${config.deviceIDs.west}' THEN 'West'
    WHEN door = '${config.deviceIDs.circle}' THEN 'Circle'
    WHEN door='${config.deviceIDs.b2}' THEN 'B2'
    END AS "DOOR",
    SUM(_data) AS "SUM(_data)"
    FROM
    (select entity_id,
        key as door,
        long_v as _data,
        TO_TIMESTAMP(TRUNC(ts/1000)) + INTERVAL '8 hour' as datetime
    from public.ts_kv
    where entity_id IN ('${config.deviceIDs.east}',
    '${config.deviceIDs.west}',
    '${config.deviceIDs.circle}',
    '${config.deviceIDs.b2}')
    and key=38
    group by key, entity_id, long_v, ts, datetime
    order by datetime desc) AS expr_qry
    WHERE datetime >= $1
    AND datetime <= $2
    AND CASE
    WHEN door = '${config.deviceIDs.east}' THEN 'East'
    WHEN door = '${config.deviceIDs.west}' THEN 'West'
    WHEN door = '${config.deviceIDs.circle}' THEN 'Circle'
    WHEN door='${config.deviceIDs.b2}' THEN 'B2'
    END ${doorType}
    GROUP BY door
    LIMIT 50000;`
}