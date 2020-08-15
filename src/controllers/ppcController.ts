import pool from '../utils/dbClient';



exports.getAllEntranceMonthlyPPC = function (req: any, res: any) {
    const { door } = req.body;
    pool.query(`
    SELECT DATE_TRUNC('month', datetime) AT TIME ZONE 'UTC' AS __timestamp,
    SUM(_data) AS "SUM(_data)"
    FROM 
(select entity_id, key as door, long_v as _data, 
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::date as datetime,
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::time as _time
    from ts_kv_latest where entity_id in ($1, $2) and
    key IN  ('visitor_count_door1','visitor_count_door2', 'visitor_count_door3', 'visitor_count_door4') 
    order by datetime desc) AS  expr_qry
     WHERE datetime >= '2019-02-01 00:00:00'
    AND datetime <= '2020-07-26 00:00:00'
    AND CASE
    WHEN door = 'visitor_count_door1' THEN 'East'
    WHEN door = 'visitor_count_door2' THEN 'West'
    WHEN door = 'visitor_count_door3' THEN 'Circle'
    WHEN door = 'visitor_count_door4' THEN 'B2'
    END = $3
    GROUP BY DATE_TRUNC('month', datetime) AT TIME ZONE 'UTC'
    ORDER BY "SUM(_data)" DESC
    LIMIT 50000;
    `, ['1ea296c156d41b083816530eccc01ed', '1ea297011afa0a083816530eccc01ed', door], (error: any, results: any) => {
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

exports.getEastEntranceMonthlyPPC = (req: any, res: any) => {
    pool.query(`select entity_id, key as door, long_v as _data, 
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::date as datetime,
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::time as _time
    from ts_kv_latest where entity_id in ($1, $2) and
    key IN  ('visitor_count_door1') 
    order by datetime desc`, ['1ea296c156d41b083816530eccc01ed', '1ea297011afa0a083816530eccc01ed'], (error: any, results: any) => {
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

exports.getWestEntranceMonthlyPPC = (req: any, res: any) => {
    pool.query(`select entity_id, key as door, long_v as _data, 
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::date as datetime,
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::time as _time
    from ts_kv_latest where entity_id in ($1, $2) and
    key IN  ('visitor_count_door2') 
    order by datetime desc`, ['1ea296c156d41b083816530eccc01ed', '1ea297011afa0a083816530eccc01ed'], (error: any, results: any) => {
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

exports.getCircleEntranceMonthlyPPC = (req: any, res: any) => {
    pool.query(`select entity_id, key as door, long_v as _data, 
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::date as datetime,
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::time as _time
    from ts_kv_latest where entity_id in ($1, $2) and
    key IN  ('visitor_count_door3') 
    order by datetime desc`, ['1ea296c156d41b083816530eccc01ed', '1ea297011afa0a083816530eccc01ed'], (error: any, results: any) => {
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

exports.getB2EntranceMonthlyPPC = (req: any, res: any) => {
    pool.query(`select entity_id, key as door, long_v as _data, 
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::date as datetime,
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::time as _time
    from ts_kv_latest where entity_id in ($1, $2) and
    key IN  ('visitor_count_door4') 
    order by datetime desc`, ['1ea296c156d41b083816530eccc01ed', '1ea297011afa0a083816530eccc01ed'], (error: any, results: any) => {
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

exports.getPPCByDateTimeRange = (req: any, res: any) => {
    const { door, date1, date2 } = req.body;
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
            order by datetime desc) AS expr_qry
        WHERE datetime >= $2
        AND datetime <= $3
        AND CASE
          WHEN door = 'visitor_count_door1' THEN 'East'
          WHEN door = 'visitor_count_door2' THEN 'West'
          WHEN door = 'visitor_count_door3' THEN 'Circle'
          WHEN door='visitor_count_door4' THEN 'B2'
        END IN ($1)
        AND CASE
          WHEN door = 'visitor_count_door1' THEN 'East'
          WHEN door = 'visitor_count_door2' THEN 'West'
          WHEN door = 'visitor_count_door3' THEN 'Circle'
          WHEN door='visitor_count_door4' THEN 'B2'
        END IN ('West',
              'Circle',
              'B2',
              'East')
        ORDER BY "SUM(_data)" DESC
        LIMIT 50000;
        `, [door, date1, date2], (error: any, results: any )=> {
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
