"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
var controller = require('../controllers/testController');
var router = express.Router();
router.route('/hello')
    .get(controller.hello);
module.exports = router;
