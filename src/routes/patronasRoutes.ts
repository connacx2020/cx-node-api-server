import * as express from 'express';
var controller = require('../controllers/patronasController');
const { authenticateJWT } = require('../utils/jwt');

var router = express.Router();

router.route('/getPatronasDataByDate')
    // .get(authenticateJWT)
    .get(controller.getPatronasDataByDate);

router.route('/getPatronasDataFromCsv')
    // .get(authenticateJWT)
    .get(controller.getPatronasDataFromCsv);

router.route('/getVehicleCountByDwellTimeRange')
    .get(controller.getVehicleCountByDwellTimeRange);

module.exports = router;
