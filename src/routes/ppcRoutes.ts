import * as express from 'express';
var controller = require('../controllers/ppcController');
const { authenticateJWT } = require('../utils/jwt');

var router = express.Router();

router.route('/getPPCByDateRange')
    // .get(authenticateJWT)
    .get(controller.getPPCByDateRange);

router.route('/getPPCByTimeRange')
    // .get(authenticateJWT)
    .get(controller.getPPCByTimeRange);

module.exports = router;
