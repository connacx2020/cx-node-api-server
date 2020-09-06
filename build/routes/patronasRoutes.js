"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
var controller = require('../controllers/patronasController');
const { authenticateJWT } = require('../utils/jwt');
var router = express.Router();
router.route('/getPatronasData')
    .get(controller.getPatronasData);
module.exports = router;
