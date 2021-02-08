import moment = require('moment');
import { config } from '../utils/config';
import pool from '../utils/dbClient';

exports.getMAGByDateRange = (req: any, res: any) => {
    const { type, door, date1, date2 } = req.query;
    const dateTime1 = `${moment(date1, 'MM/DD/YYYY').toDate().toLocaleDateString()} 00:00:00`;
    const dateTime2 = `${moment(date2, 'MM/DD/YYYY').add(1, 'day').toDate().toLocaleDateString()} 00:00:00`;
    const query = getQuery(type, door);
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

exports.getMAGByTimeRange = (req: any, res: any) => {
    const { type, door, date, time1, time2 } = req.query;
    const dateTime1 = `${moment(date, 'MM/DD/YYYY').toDate().toLocaleDateString()} ${time1}`;
    const dateTime2 = `${moment(date, 'MM/DD/YYYY').toDate().toLocaleDateString()} ${time2}`;
    const query = getQuery(type, door);
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

const getQuery = (type: string, door: string) => {
    var is_type = '';
    switch (type) {
        case 'mood': is_type = '41,42,43,48'; break;
        case 'age': is_type = '44,45,46,47'; break;
        case 'gender': is_type = '37,40'; break;
        default: is_type = '41,42,43,48'; break;
    }

    var doorType = '';
    switch (door) {
        case 'all': doorType = " != '0'"; break
        case 'east': doorType = " = 'East'"; break;
        case 'west': doorType = " = 'West'"; break;
        case 'circle': doorType = " = 'Circle'"; break;
        case 'b2': doorType = " = 'B2'"; break;
        default: doorType = " != '0'"; break
    }

    return `
    SELECT
    CASE
    WHEN key = 43 THEN 'Neutral'
    WHEN key = 42 THEN 'Sad'
    WHEN key = 41 THEN 'Happy'
    WHEN key = 48 THEN 'Angry'
    WHEN key = 37 THEN 'Male'
    WHEN key = 40 THEN 'Female'
    WHEN key = 44 THEN 'Children'
    WHEN key = 47 THEN 'Young'
    WHEN key = 45 THEN 'Middle'
    WHEN key = 46 THEN 'Senior'
    END AS "Key",
    COUNT(CASE
        WHEN key = 43 THEN 'Neutral'
        WHEN key = 42 THEN 'Sad'
        WHEN key = 41 THEN 'Happy'
        WHEN key = 48 THEN 'Angry'
        WHEN key = 37 THEN 'Male'
        WHEN key = 40 THEN 'Female'
        WHEN key = 44 THEN 'Children'
        WHEN key = 47 THEN 'Young'
        WHEN key = 45 THEN 'Middle'
        WHEN key = 46 THEN 'Senior'
         END) AS "COUNT(Key)"
    FROM
    (select entity_id,
    key,
    TO_TIMESTAMP(TRUNC(ts/1000)) + INTERVAL '8 hour' AS datetime,
    long_v
    FROM ts_kv
    where entity_id in (
        '${config.deviceIDs.east}',
        '${config.deviceIDs.west}',
        '${config.deviceIDs.circle}',
        '${config.deviceIDs.b2}')
    and key in (${is_type})) AS expr_qry
    WHERE datetime >= $1
    AND datetime <= $2
    AND CASE
        WHEN key = 43 THEN 'Neutral'
        WHEN key = 42 THEN 'Sad'
        WHEN key = 41 THEN 'Happy'
        WHEN key = 48 THEN 'Angry'
        WHEN key = 37 THEN 'Male'
        WHEN key = 40 THEN 'Female'
        WHEN key = 44 THEN 'Children'
        WHEN key = 47 THEN 'Young'
        WHEN key = 45 THEN 'Middle'
        WHEN key = 46 THEN 'Senior'
    END != '0'
    AND CASE
        WHEN entity_id = '${config.deviceIDs.east}' THEN 'East'
        WHEN entity_id = '${config.deviceIDs.west}' THEN 'West'
        WHEN entity_id = '${config.deviceIDs.circle}' THEN 'Circle'
        WHEN entity_id ='${config.deviceIDs.b2}' THEN 'B2'
    END ${doorType}
    GROUP BY CASE
    WHEN key = 43 THEN 'Neutral'
    WHEN key = 42 THEN 'Sad'
    WHEN key = 41 THEN 'Happy'
    WHEN key = 48 THEN 'Angry'
    WHEN key = 37 THEN 'Male'
    WHEN key = 40 THEN 'Female'
    WHEN key = 44 THEN 'Children'
    WHEN key = 47 THEN 'Young'
    WHEN key = 45 THEN 'Middle'
    WHEN key = 46 THEN 'Senior'
    END
    ORDER BY "COUNT(Key)" DESC
    LIMIT 10000;
    `
}