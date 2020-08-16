import pool from '../utils/dbClient';

exports.getPPCByDateTimeRange = (req: any, res: any) => {
    const { door, date1, date2, time1, time2 } = req.query;

    const dateTime1 = `${date1} ${time1}`;
    const dateTime2 = `${date2} ${time2}`;

    var doorType = '';
    switch (door.toLowerCase()) {
        case 'all': doorType = " != '0'"; break
        case 'east': doorType = " = 'East'"; break;
        case 'west': doorType = " = 'West'"; break;
        case 'circle': doorType = " = 'Circle'"; break;
        case 'b2': doorType = " = 'B2'"; break;
        default: doorType = " != '0'"; break
    }
    pool.query(
        `
        SELECT 
            SUM(_data) AS "SUM(_data)"
        FROM
        (select entity_id,
            key as door,
            long_v as _data,
            TO_TIMESTAMP(TRUNC(CAST(ts AS bigint) / 1000))::date as datetime,
            TO_TIMESTAMP(TRUNC(CAST(ts AS bigint) / 1000))::time as _time
            from ts_kv
            where entity_id in ('1ea296c156d41b083816530eccc01ed',
                '1ea297011afa0a083816530eccc01ed')
            and key IN ('visitor_count_door1',
                'visitor_count_door2',
                'visitor_count_door3',
                'visitor_count_door4',
                'outsideMaxTemp')
            group by key, entity_id, long_v, ts
            order by datetime desc) AS expr_qry
        WHERE datetime >= $1
        AND datetime <= $2
        AND CASE
          WHEN door = 'visitor_count_door1' THEN 'East'
          WHEN door = 'visitor_count_door2' THEN 'West'
          WHEN door = 'visitor_count_door3' THEN 'Circle'
          WHEN door='visitor_count_door4' THEN 'B2'
        END ${doorType}
        ORDER BY "SUM(_data)" DESC
        LIMIT 50000;
        `, [ dateTime1, dateTime2], (error: any, results: any )=> {
            if (error) {
                throw error;
            }
            res.status(200).json({
                status: 200,
                message: 'Successful!',
                data: results.rows
            }).end();
        }
    )
}
