"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
var controller = require('../controllers/authController');
var router = express.Router();
router.route('/login')
    .post(controller.login);
module.exports = router;
