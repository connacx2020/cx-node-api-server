"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbClient_1 = require("../utils/dbClient");
exports.getPatronasData = (req, res) => {
    const deviceID = "f62241e0-edc2-11ea-a72f-7398ea06dc89";
    dbClient_1.default.query(`select * from ts_kv where entity_id=$1 order by key;`, [deviceID], (error, results) => {
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
