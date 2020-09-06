"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbClient_1 = require("../utils/dbClient");
exports.getPatronasData = (req, res) => {
    const deviceID = "f62241e0-edc2-11ea-a72f-7398ea06dc89";
    dbClient_1.default.query(`select * from ts_kv where entity_id=$1 order by key;`, [deviceID], (error, results) => {
        if (error) {
            throw error;
        }
        const data = results.rows;
        const returnData = [];
        data.forEach((res) => {
            switch (res.key) {
                case 7: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "count",
                        data: res.long_v,
                        ts: res.ts
                    });
                    break;
                }
                case 8: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump1_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 9: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump2_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 10: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump3_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 11: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump4_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 12: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump5_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 13: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump6_data",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
                case 14: {
                    returnData.push({
                        entity_id: res.entity_id,
                        key: "pump1",
                        data: res.json_v,
                        ts: res.ts
                    });
                    break;
                }
            }
        });
        res.status(200).json({
            status: 200,
            message: 'Successful!',
            data: returnData
        }).end();
    });
};
