"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
var controller = require('../controllers/ppcController');
const { authenticateJWT } = require('../utils/jwt');
var router = express.Router();
router.route('/getPPCByDateRange')
    .get(controller.getPPCByDateRange);
router.route('/getPPCByTimeRange')
    .get(controller.getPPCByTimeRange);
module.exports = router;
