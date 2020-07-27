import pool from '../utils/dbClient';

exports.getEntranceData = (req: any, res: any) => {
    pool.query(`SELECT entity_id,
        key,
        TO_TIMESTAMP(TRUNC(CAST(ts AS bigint) / 1000)) AS datetime,
        long_v
        FROM ts_kv_latest
        WHERE entity_id IN ('1ea2b7fc3fa406083816530eccc01ed',
        '1ea2b7fbabb75f083816530eccc01ed',
        '1ea2a3e774ee6e083816530eccc01ed',
        '1ea2a319d9a986083816530eccc01ed')
        AND key LIKE 'is_%'`, (error: any, results: any) => {
        res.status(200).json({
            status: 200,
            message: 'successful!',
            data: results.rows
        });
    });
}

exports.getMonthlyGenderAllEntrance = (req: any, res: any) => {
    const { gender } = req.body;
    pool.query(`SELECT DATE_TRUNC('month', datetime) AT TIME ZONE 'UTC' AS __timestamp,
    SUM(long_v) AS "SUM(long_v)"s
        FROM
        (SELECT entity_id,
        key,
        TO_TIMESTAMP(TRUNC(CAST(ts AS bigint) / 1000)) AS datetime,
        long_v
        FROM ts_kv_latest
        WHERE entity_id IN ('1ea2b7fc3fa406083816530eccc01ed',
        '1ea2b7fbabb75f083816530eccc01ed',
        '1ea2a3e774ee6e083816530eccc01ed',
        '1ea2a319d9a986083816530eccc01ed')
        AND key LIKE 'is_%') AS expr_qry
        WHERE datetime >= '2019-01-1 00:00:00'
        AND datetime <= '2020-07-27 00:00:00'
        AND key = $1
        GROUP BY DATE_TRUNC('month', datetime) AT TIME ZONE 'UTC'
        ORDER BY "SUM(long_v)" DESC
        LIMIT 50000;`, [gender], (error: any, results: any) => {
        res.status(200).json({
            status: 200,
            message: 'successful!',
            data: results.rows
        });
    });
}

exports.getMonthlyMoodAllEntrance = (req: any, res: any) => {
    const { mood } = req.body; //["is_feeling_happy", "is_feeling_sad", "is_feeling_neutral", "is_feeling_angry"]
    pool.query(`SELECT DATE_TRUNC('month', datetime) AT TIME ZONE 'UTC' AS __timestamp,
    SUM(long_v) AS "SUM(long_v)"
        FROM
        (SELECT entity_id,
        key,
        TO_TIMESTAMP(TRUNC(CAST(ts AS bigint) / 1000)) AS datetime,
        long_v
        FROM ts_kv_latest
        WHERE entity_id IN ('1ea2b7fc3fa406083816530eccc01ed',
        '1ea2b7fbabb75f083816530eccc01ed',
        '1ea2a3e774ee6e083816530eccc01ed',
        '1ea2a319d9a986083816530eccc01ed')
        AND key LIKE 'is_%') AS expr_qry
        WHERE datetime >= '2019-01-1 00:00:00'
        AND datetime <= '2020-07-27 00:00:00'
        AND key = $1
        GROUP BY DATE_TRUNC('month', datetime) AT TIME ZONE 'UTC'
        ORDER BY "SUM(long_v)" DESC
        LIMIT 50000;`, [mood], (error: any, results: any) => {
        res.status(200).json({
            status: 200,
            message: 'successful!',
            data: results.rows
        });
    });

    exports.getMonthlyAgeAllEntrance = (req: any, res: any) => {
        const { age } = req.body; //["is_age_senior", "is_age_middle", "is_age_young", "is_age_teenager"]
        pool.query(`SELECT DATE_TRUNC('month', datetime) AT TIME ZONE 'UTC' AS __timestamp,
        SUM(long_v) AS "SUM(long_v)"
            FROM
            (SELECT entity_id,
            key,
            TO_TIMESTAMP(TRUNC(CAST(ts AS bigint) / 1000)) AS datetime,
            long_v
            FROM ts_kv_latest
            WHERE entity_id IN ('1ea2b7fc3fa406083816530eccc01ed',
            '1ea2b7fbabb75f083816530eccc01ed',
            '1ea2a3e774ee6e083816530eccc01ed',
            '1ea2a319d9a986083816530eccc01ed')
            AND key LIKE 'is_%') AS expr_qry
            WHERE datetime >= '2019-01-1 00:00:00'
            AND datetime <= '2020-07-27 00:00:00'
            AND key = $1
            GROUP BY DATE_TRUNC('month', datetime) AT TIME ZONE 'UTC'
            ORDER BY "SUM(long_v)" DESC
            LIMIT 50000;`, [age], (error: any, results: any) => {
            res.status(200).json({
                status: 200,
                message: 'successful!',
                data: results.rows
            });
        });
    }
}

exports.getMoodPercentAllEntrance = (req:any, res:any) => {
    pool.query(`
    SELECT CASE
           WHEN key = 'is_feeling_neutral' THEN 'Neutral'
           WHEN key = 'is_feeling_angry' THEN 'Angry'
           WHEN key = 'is_feeling_sad' THEN 'Sad'
           WHEN key = 'is_feeling_happy' THEN 'Happy'
       END AS "Mood",
       SUM(long_v) AS "SUM(long_v)"
FROM
  (SELECT entity_id,
          key,
          TO_TIMESTAMP(TRUNC(CAST(ts AS bigint) / 1000)) AS datetime,
          long_v
   FROM public.ts_kv
   WHERE entity_id IN ('1ea2b7fc3fa406083816530eccc01ed',
                       '1ea2b7fbabb75f083816530eccc01ed',
                       '1ea2a3e774ee6e083816530eccc01ed',
                       '1ea2a319d9a986083816530eccc01ed')
        AND key LIKE 'is_%') AS expr_qry
    WHERE datetime >= '2020-05-27 00:00:00'
    AND datetime <= '2020-07-27 00:00:00'
    AND CASE
          WHEN key = 'is_feeling_neutral' THEN 'Neutral'
          WHEN key = 'is_feeling_angry' THEN 'Angry'
          WHEN key = 'is_feeling_sad' THEN 'Sad'
          WHEN key = 'is_feeling_happy' THEN 'Happy'
      END != '0'
    GROUP BY CASE
             WHEN key = 'is_feeling_neutral' THEN 'Neutral'
             WHEN key = 'is_feeling_angry' THEN 'Angry'
             WHEN key = 'is_feeling_sad' THEN 'Sad'
             WHEN key = 'is_feeling_happy' THEN 'Happy'
         END
    ORDER BY "SUM(long_v)" DESC
    LIMIT 50000;`);
}