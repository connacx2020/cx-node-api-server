"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const magRoutes = require('./routes/magRoutes');
const ppcRoutes = require('./routes/ppcRoutes');
const authRoutes = require('./routes/authRoutes');
dotenv.config();
var app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/mag', magRoutes);
app.use('/ppc', ppcRoutes);
var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening at http://${process.env.HOST}:${port}`);
});