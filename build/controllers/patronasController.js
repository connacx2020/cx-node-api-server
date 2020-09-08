"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbClient_1 = require("../utils/dbClient");
exports.getPatronasData = (req, res) => {
    const deviceID = "f62241e0-edc2-11ea-a72f-7398ea06dc89";
    const { date } = req.query;
    const datetime1 = `${date} 07:00:00`;
    const datetime2 = `${date} 22:00:00`;
    dbClient_1.default.query(`
        SELECT CASE
        WHEN key = '8' THEN 'pump1'
        WHEN key = '9' THEN 'pump2'
        WHEN key = '10' THEN 'pump3'
        WHEN key='11' THEN 'pump4'
        WHEN key='12' THEN 'pump5'
        WHEN key='13' THEN 'pump6'
        END AS "KEY", json_v, ts, long_v, datetime
        FROM 
        (select entity_id, key, long_v, json_v, ts,
        TO_TIMESTAMP(TRUNC(ts/1000)) as datetime
        from ts_kv 
        where entity_id=$1 
        AND key IN ('8', '9', '10', '11', '12', '13')) AS expr_qry
        WHERE datetime >= $2
        AND datetime <= $3
        ORDER BY ts;
        `, [deviceID, datetime1, datetime2], (error, results) => {
        if (error) {
            throw error;
        }
        const data = results.rows;
        const startTime = 13;
        const endTime = 15;
        var binCount = endTime - startTime;
        var pump = {
            pump1: [],
            pump2: [],
            pump3: [],
            pump4: [],
            pump5: [],
            pump6: []
        };
        for (var i = 0; i < binCount; i++) {
            const bin = {
                vehicleType1: {
                    count: 0,
                    dwellTime: 0
                },
                vehicleType2: {
                    count: 0,
                    dwellTime: 0
                },
                vehicleType3: {
                    count: 0,
                    dwellTime: 0
                },
                vehicleType4: {
                    count: 0,
                    dwellTime: 0
                }
            };
            pump.pump1.push(bin);
            pump.pump2.push(bin);
            pump.pump3.push(bin);
            pump.pump4.push(bin);
            pump.pump5.push(bin);
            pump.pump6.push(bin);
        }
        console.log(pump);
        for (var i = 0; i < binCount; i++) {
            const start = startTime + i;
            const time1 = new Date(`${date} ${start}:00:00`);
            const time2 = new Date(time1.getTime() + 3600 * 1000);
            data.forEach((pumpData) => {
                if (pumpData.datetime >= time1 && pumpData.datetime < time2) {
                    switch (pumpData.KEY) {
                        case 'pump1': {
                            const pump1Data = pump.pump1;
                            const count = pumpData.json_v.count;
                            const dwellTime = pumpData.json_v.time;
                            const vehicleType = pumpData.json_v.vehicleType;
                            if (vehicleType == 'type1') {
                                pump1Data[i].vehicleType1.count += count;
                                pump1Data[i].vehicleType1.dwellTime += dwellTime;
                            }
                            else if (vehicleType == 'type2') {
                                pump1Data[i].vehicleType2.count += count;
                                pump1Data[i].vehicleType2.dwellTime += dwellTime;
                            }
                            else if (vehicleType == 'type3') {
                                pump1Data[i].vehicleType3.count += count;
                                pump1Data[i].vehicleType3.dwellTime += dwellTime;
                            }
                            else if (vehicleType == 'type4') {
                                pump1Data[i].vehicleType4.count += count;
                                pump1Data[i].vehicleType4.dwellTime += dwellTime;
                            }
                            console.log(pump1Data);
                            break;
                        }
                        case 'pump2': {
                            const pump2Data = pump.pump2;
                            console.log("Pump2", pump2Data);
                            break;
                        }
                        case 'pump3': {
                            break;
                        }
                        case 'pump4': {
                            break;
                        }
                        case 'pump5': {
                            break;
                        }
                        case 'pump6': {
                            break;
                        }
                    }
                }
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Successful!',
            pumpData: pump
        }).end();
    });
};
