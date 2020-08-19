import pool from '../utils/dbClient';

exports.getMAGByDateTimeRange = (req: any, res: any) => {
    const { type, door, date1, date2, time1, time2 } = req.query;
    var is_type = '';
    switch (type) {
        case 'mood': is_type = 'is_feeling_%'; break;
        case 'age': is_type = 'is_age_%'; break;
        case 'gender': is_type = 'is_sex_%'; break;
        default: is_type = 'is_feeling_%'; break;
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
    const dateTime1 = `${date1} ${time1}`
    const dateTime2 = `${date2} ${time2}`
    const query = `
        SELECT
        CASE
            WHEN key = 'is_feeling_neutral' THEN 'Neutral'
            WHEN key = 'is_feeling_sad' THEN 'Sad'
            WHEN key = 'is_feeling_happy' THEN 'Happy'
            WHEN key = 'is_feeling_angry' THEN 'Angry'
            WHEN key = 'is_sex_male' THEN 'Male'
            WHEN key = 'is_sex_female' THEN 'Female'
            WHEN key = 'is_age_teenager' THEN 'Children'
            WHEN key = 'is_age_young' THEN 'Young'
            WHEN key = 'is_age_middle' THEN 'Middle'
            WHEN key = 'is_age_senior' THEN 'Senior'
        END AS "Key",
        COUNT(CASE
                WHEN key = 'is_feeling_neutral' THEN 'Neutral'
                WHEN key = 'is_feeling_sad' THEN 'Sad'
                WHEN key = 'is_feeling_happy' THEN 'Happy'
                WHEN key = 'is_feeling_angry' THEN 'Angry'
                WHEN key = 'is_sex_male' THEN 'Male'
                WHEN key = 'is_sex_female' THEN 'Female'
                WHEN key = 'is_age_teenager' THEN 'Children'
                WHEN key = 'is_age_young' THEN 'Young'
                WHEN key = 'is_age_middle' THEN 'Middle'
                WHEN key = 'is_age_senior' THEN 'Senior'
             END) AS "COUNT(Key)"
        FROM
        (SELECT entity_id,
        key,
        TO_TIMESTAMP(TRUNC(ts/1000)) AS datetime,
        long_v
        FROM public.ts_kv
        where entity_id in ('1ea2b7fc3fa406083816530eccc01ed',
                    '1ea2b7fbabb75f083816530eccc01ed',
                    '1ea2a3e774ee6e083816530eccc01ed',
                    '1ea2a319d9a986083816530eccc01ed')
        and key like $1) AS expr_qry
        WHERE datetime >= $2
        AND datetime <= $3
        AND CASE
            WHEN key = 'is_feeling_neutral' THEN 'Neutral'
            WHEN key = 'is_feeling_sad' THEN 'Sad'
            WHEN key = 'is_feeling_happy' THEN 'Happy'
            WHEN key = 'is_feeling_angry' THEN 'Angry'
            WHEN key = 'is_sex_male' THEN 'Male'
            WHEN key = 'is_sex_female' THEN 'Female'
            WHEN key = 'is_age_teenager' THEN 'Children'
            WHEN key = 'is_age_young' THEN 'Young'
            WHEN key = 'is_age_middle' THEN 'Middle'
            WHEN key = 'is_age_senior' THEN 'Senior'
        END != '0'
        AND CASE
            WHEN entity_id = '1ea2a319d9a986083816530eccc01ed' THEN 'East'
            WHEN entity_id = '1ea2a3e774ee6e083816530eccc01ed' THEN 'West'
            WHEN entity_id = '1ea2b7fbabb75f083816530eccc01ed' THEN 'Circle'
            WHEN entity_id ='1ea2b7fc3fa406083816530eccc01ed' THEN 'B2'
        END ${doorType}
        GROUP BY CASE
            WHEN key = 'is_feeling_neutral' THEN 'Neutral'
            WHEN key = 'is_feeling_sad' THEN 'Sad'
            WHEN key = 'is_feeling_happy' THEN 'Happy'
            WHEN key = 'is_feeling_angry' THEN 'Angry'
            WHEN key = 'is_sex_male' THEN 'Male'
            WHEN key = 'is_sex_female' THEN 'Female'
            WHEN key = 'is_age_teenager' THEN 'Children'
            WHEN key = 'is_age_young' THEN 'Young'
            WHEN key = 'is_age_middle' THEN 'Middle'
            WHEN key = 'is_age_senior' THEN 'Senior'
        END
        ORDER BY "COUNT(Key)" DESC
        LIMIT 10000;
        `
    pool.query(query, [is_type, dateTime1, dateTime2], (error: any, results: any) => {
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
