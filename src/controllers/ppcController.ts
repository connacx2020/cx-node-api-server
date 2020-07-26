import pool from '../utils/dbClient';

exports.getAllEntranceMonthlyPPC = function (req: any, res: any) {
    pool.query(`select entity_id, key as door, long_v as _data, 
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::date as datetime,
    TO_TIMESTAMP( TRUNC( CAST( ts AS bigint ) / 1000 ))::time as _time
    from ts_kv_latest where entity_id in ($1, $2) and
    key IN  ('visitor_count_door1','visitor_count_door2', 'visitor_count_door3', 'visitor_count_door4') 
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
