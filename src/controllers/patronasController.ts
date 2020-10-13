import pool from '../utils/dbClient';
const fs = require('fs');
const csv = require('csv-parser');

exports.getPatronasDataByDate = (req: any, res: any) => {
    const deviceID = "f62241e0-edc2-11ea-a72f-7398ea06dc89";
    const { date } = req.query;

    const datetime1 = `${date} 07:00:00`;
    const datetime2 = `${date} 22:00:00`;
    pool.query(
        `
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
        `, [deviceID, datetime1, datetime2], (error: any, results: any) => {
        if (error) {
            throw error;
        }
        const data = results.rows;
        const startTime = 7;
        const endTime = 22;
        var binCount = endTime - startTime;
        var pump: any = {
            pump1: [],
            pump2: [],
            pump3: [],
            pump4: [],
            pump5: [],
            pump6: []
        };

        const calculateVehicleCount = (vehicleType: string, count: number, time: any, datetime: any, time1: any, time2: any) => {
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
            }

            if (datetime >= time1 && datetime < time2) {
                switch (vehicleType) {
                    case 'type1': {
                        bin.vehicleType1.count += count;
                        bin.vehicleType1.dwellTime += time;
                        break;
                    }
                    case 'type2': {
                        bin.vehicleType2.count += count;
                        bin.vehicleType2.dwellTime += time;
                        break;
                    }
                    case 'type3': {
                        bin.vehicleType3.count += count;
                        bin.vehicleType3.dwellTime += time;
                        break;
                    }
                    case 'type4': {
                        bin.vehicleType4.count += count;
                        bin.vehicleType4.dwellTime += time;
                        break;
                    }
                    default: break;
                }
            }
            return bin;
        }
        for (var i = 0; i < binCount; i++) {
            const start = startTime + i;
            const time1 = new Date(`${date} ${start}:00:00`);
            const time2 = new Date(time1.getTime() + 3600 * 1000);

            for (var pmpData of data) {
                const vehicleType = pmpData['json_v'].vehicleType;
                const count = pmpData['json_v'].count;
                var dwellTime = pmpData['json_v'].time;
                var dwellTimeSplited = dwellTime.split(' ');
                if (dwellTimeSplited.length > 2) {
                    if (dwellTimeSplited[1] == 'mins' && dwellTimeSplited[3] == 'secs') {
                        dwellTime = Number(dwellTimeSplited[0]) * 60 + Number(dwellTimeSplited[2]);
                    }
                } else {
                    if (dwellTimeSplited[1] == 'mins') {
                        dwellTime = Number(dwellTimeSplited[0]) * 60;
                    } else {
                        dwellTime = Number(dwellTimeSplited[0]);
                    }
                }
                const datetime = pmpData.datetime;
                const bin = calculateVehicleCount(vehicleType, count, dwellTime, datetime, time1, time2);
                switch (pmpData.KEY) {
                    case 'pump1': {
                        pump.pump1.push(bin);
                        break;
                    }
                    case 'pump2':
                        {
                            pump.pump2.push(bin);
                            break;
                        }
                    case 'pump3':
                        {
                            pump.pump3.push(bin);
                            break;
                        }
                    case 'pump4':
                        {
                            pump.pump4.push(bin);
                            break;
                        }
                    case 'pump5':
                        {
                            pump.pump5.push(bin);
                            break;
                        }
                    case 'pump6': {
                        pump.pump6.push(bin);
                        break;
                    }
                    default: break;
                }
            }
        }

        res.status(200).json({
            status: 200,
            message: 'Successful!',
            pumpData: pump
        }).end();
    });
}

exports.getPatronasDataFromCsv = (req: any, res: any) => {
    const { date } = req.query;
    var csvData: any[] = [];
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

    fs.createReadStream(__dirname + '/../data/pumpCsv.csv')
        .pipe(csv())
        .on('data', (row: any) => {
            csvData.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');

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

                csvData.forEach(data => {
                    const splitedStartTime = data.startTime.split(' ');
                    const splitDate = splitedStartTime[0].split('/');
                    const date = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2]
                    const datetime = new Date(date + ' ' + splitedStartTime[1]);

                    const splitedEndDateTime = data.endTime.split(' ');
                    const splitedEndDate = splitedEndDateTime[0].split('/');
                    const endDate = splitedEndDate[1] + '/' + splitedEndDate[0] + '/' + splitedEndDate[2]
                    const endDatetime = new Date(endDate + ' ' + splitedEndDateTime[1]);
                    const dwellTime = (Number(endDatetime.getTime()) - Number(datetime.getTime())) / 1000;

                    if (datetime >= datetime1 && datetime < datetime2) {
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
                                if (data.pump == 1) {
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
                                if (data.pump == 2) {
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
                                if (data.pump == 3) {
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
                                if (data.pump == 7) {
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
                                if (data.pump == 8) {
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
                                if (data.pump == 9) {
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

            res.status(200).json({
                status: 200,
                message: 'Successful!',
                pumpData: pump
            }).end();
        });
};
