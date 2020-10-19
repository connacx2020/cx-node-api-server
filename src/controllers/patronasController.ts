import pool from '../utils/dbClient';
const fs = require('fs');
const csv = require('csv-parser');

const calculateVehicleCount = (pumpData: any[]) => {
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
        }
    }
    pumpData.forEach(data => {
        const dwellTime = data.dwellTime;
        switch (data.vehicleType) {
            case 'type1': {
                ++bin.vehicleType1.count;
                bin.vehicleType1.dwellTime += dwellTime;
                break;
            }
            case 'type2': {
                ++bin.vehicleType2.count;
                bin.vehicleType2.dwellTime += dwellTime;
                break;
            }
            case 'type3': {
                ++bin.vehicleType3.count;
                bin.vehicleType3.dwellTime += dwellTime;
                break;
            }
            default: break;
        }
    });
    return bin;
}
const doData = (allData: any[], date: string,) => {
    const pump: any = {
        pump1: [],
        pump2: [],
        pump3: [],
        pump7: [],
        pump8: [],
        pump9: []
    };

    const startTime = 0;
    const endTime = 24;
    var binCount = endTime - startTime;

    for (var i = 0; i < binCount; i++) {
        const start = startTime + i;
        const datetime1 = new Date(`${date} ${start}:00:00`);;
        const datetime2 = new Date(datetime1.getTime() + 3600 * 1000);

        const binPumpData: any[] = [];

        allData.forEach(data => {
            const splittedStartDateTime = data.startTime.split(' ');
            const splittedStartDate = splittedStartDateTime[0].split('/');
            const startDateTime = new Date(`${splittedStartDate[1]}/${splittedStartDate[0]}/${splittedStartDate[2]} ${splittedStartDateTime[1]}`);

            const splittedEndDateTime = data.endTime.split(' ');
            const splittedEndDate = splittedEndDateTime[0].split('/');
            const endDateTime = new Date(`${splittedEndDate[1]}/${splittedEndDate[0]}/${splittedEndDate[2]} ${splittedEndDateTime[1]}`);

            const dwellTime = (Number(endDateTime.getTime()) - Number(startDateTime.getTime())) / 1000;

            if (startDateTime >= datetime1 && startDateTime < datetime2 || endDateTime >= datetime1 && endDateTime < datetime2) {
                binPumpData.push({
                    pump: data.pump,
                    vehicleType: data.vehicleType,
                    dwellTime
                });
            }
        });

        var pumps = [1, 2, 3, 7, 8, 9];
        pumps.forEach((pumpNumber: number) => {
            switch (pumpNumber) {
                case 1: {
                    const pumpData: any[] = []
                    binPumpData.forEach(data => {
                        if (data.pump == 'pump1') {
                            pumpData.push(data);
                        }
                    });
                    const pump1Data = calculateVehicleCount(pumpData);
                    pump.pump1.push(pump1Data);
                    break;
                }
                case 2: {
                    const pumpData: number[] = []
                    binPumpData.forEach(data => {
                        if (data.pump == 'pump2') {
                            pumpData.push(data);
                        }
                    });
                    const result = calculateVehicleCount(pumpData);
                    pump.pump2.push(result);
                    break;
                }
                case 3: {
                    const pumpData: any[] = []
                    binPumpData.forEach(data => {
                        if (data.pump == 'pump3') {
                            pumpData.push(data);
                        }
                    });
                    const result = calculateVehicleCount(pumpData);
                    pump.pump3.push(result);
                    break;
                }
                case 7: {
                    const pumpData: any[] = []
                    binPumpData.forEach(data => {
                        if (data.pump == 'pump7') {
                            pumpData.push(data);
                        }
                    });
                    const result = calculateVehicleCount(pumpData);
                    pump.pump7.push(result);
                    break;
                }
                case 8: {
                    const pumpData: any[] = []
                    binPumpData.forEach(data => {
                        if (data.pump == 'pump8') {
                            pumpData.push(data);
                        }
                    });
                    const result = calculateVehicleCount(pumpData);
                    pump.pump8.push(result);
                    break;
                }
                case 9: {
                    const pumpData: any[] = []
                    binPumpData.forEach(data => {
                        if (data.pump == 'pump9') {
                            pumpData.push(data);
                        }
                    });
                    const result = calculateVehicleCount(pumpData);
                    pump.pump9.push(result);
                    break;
                }
                default: break;
            }
        });
    }
    return pump;
}

exports.getPatronasDataByDate = (req: any, res: any) => {
    const deviceID = 'f62241e0-edc2-11ea-a72f-7398ea06dc89';
    const { date } = req.query;
    const splittedDate = date.split('/');
    const dateTime1 = new Date(Date.parse(`${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`));
    const dateTime2 = new Date(dateTime1.getTime() + 3600 * 24 * 1000);
    try {
        pool.query(
            `
            SELECT CASE
            WHEN key = '8' THEN 'pump1'
            WHEN key = '9' THEN 'pump2'
            WHEN key = '10' THEN 'pump3'
            WHEN key='15' THEN 'pump7'
            WHEN key='16' THEN 'pump8'
            WHEN key='17' THEN 'pump9'
            END AS "KEY", json_v, ts, long_v, datetime
            FROM 
            (select entity_id, key, long_v, json_v, ts,
            TO_TIMESTAMP(TRUNC(ts/1000)) as datetime
            from ts_kv 
            where entity_id=$1 
            AND key IN ('8', '9', '10', '15', '16', '17')) AS expr_qry
            WHERE datetime >= $2
            AND datetime < $3
            ORDER BY ts;
            `, [deviceID, dateTime1, dateTime2], (error: any, results: any) => {
            if (error) {
                console.log(error)
                res.status(400).json({
                    status: 400,
                    message: 'Failed!',
                    pumpData: []
                }).end();
            } else {
                let data = results.rows;
                data = data.map((res: any) => {
                    const { KEY, json_v, datetime } = res;
                    const { startTime, endTime, vehicleType } = json_v;
                    const dateTimeSting = new Date(datetime).toLocaleString();
                    return {
                        pump: KEY,
                        startTime,
                        endTime,
                        vehicleType,
                        dateTimeSting
                    }
                });
                const result = doData(data, date);
                res.status(200).json({
                    status: 200,
                    message: 'Successful!',
                    pumpData: result
                }).end();
            }
        });
    } catch (error) {
        throw error;
    }
}

exports.getPatronasDataFromCsv = (req: any, res: any) => {
    const { date } = req.query;
    var csvData: any[] = [];


    fs.createReadStream(__dirname + '/../data/pumpCsv.csv')
        .pipe(csv())
        .on('data', (row: any) => {
            csvData.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            const result = doData(csvData, date);
            res.status(200).json({
                status: 200,
                message: 'Successful!',
                pumpData: result
            }).end();
        });
};
