"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbClient_1 = require("../utils/dbClient");
exports.getPPCByDateTimeRange = (req, res) => {
    const { door, date1, date2, time1, time2 } = req.query;
    console.log(door);
    var doorType = '';
    switch (door) {
        case 'all':
            doorType = " != '0'";
            break;
        case 'east':
            doorType = " = 'East'";
            break;
        case 'west':
            doorType = " = 'West'";
            break;
        case 'circle':
            doorType = " = 'Circle'";
            break;
        case 'b2':
            doorType = " = 'B2'";
            break;
    }
    console.log(doorType);
    const dateTime1 = `${date1} ${time1}`;
    const dateTime2 = `${date2} ${time2}`;
    dbClient_1.default.query(`
        SELECT
        CASE 
        WHEN door = 'visitor_count_door1' THEN 'East'
        WHEN door = 'visitor_count_door2' THEN 'West'
        WHEN door = 'visitor_count_door3' THEN 'Circle'
        WHEN door='visitor_count_door4' THEN 'B2'
        END AS "DOOR",
        SUM(total_num) AS "SUM(total_num)"
        FROM
        (select key as door,
            TO_TIMESTAMP(TRUNC(ts/1000))::date as datetime,
            long_v as total_num
        from ts_kv
        where key IN ('visitor_count_door1',
        'visitor_count_door2'
        'visitor_count_door3'
        'visitor_count_door4')) AS expr_qry
        WHERE datetime >= $1
        AND datetime <= $2
        AND CASE 
        WHEN door = 'visitor_count_door1' THEN 'East'
        WHEN door = 'visitor_count_door2' THEN 'West'
        WHEN door = 'visitor_count_door3' THEN 'Circle'
        WHEN door='visitor_count_door4' THEN 'B2'
        END ${doorType}
        GROUP BY door
        LIMIT 10000;
        `, [dateTime1, dateTime2], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json({
            status: 200,
            message: 'Successful!',
            data: results.rows
        }).end();
    });
};
