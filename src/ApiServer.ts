import express = require('express');
import bodyParser = require('body-parser');
import dotenv = require('dotenv');
import pool from './utils/dbClient';

const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const magRoutes = require('./routes/magRoutes');
const ppcRoutes = require('./routes/ppcRoutes');

pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
pool.query(`
    CREATE TABLE IF NOT EXISTS users (id uuid DEFAULT uuid_generate_v4(),
    username VARCHAR UNIQUE NOT NULL,
    password json NOT NULL,
    name VARCHAR NOT NULL,
    client VARCHAR NOT NULL,
    token VARCHAR DEFAULT null,
    tokenExpiryTime TIMESTAMP DEFAULT null,
    PRIMARY KEY (id))`
);

dotenv.config();

var app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user', userRoutes);
app.use('/mag', magRoutes);
app.use('/ppc', ppcRoutes);

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening at http://${process.env.HOST}:${port}`)
});
