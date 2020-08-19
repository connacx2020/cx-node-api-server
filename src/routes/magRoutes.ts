import * as express from 'express';
var controller = require('../controllers/magController');
const { authenticateJWT } = require('../utils/jwt');

var router = express.Router();

router.route('/getMAGByDateRange')
    // .get(authenticateJWT)
    .get(controller.getMAGByDateRange);

router.route('/getMAGByTimeRange')
    // .get(authenticateJWT)
    .get(controller.getMAGByTimeRange);

module.exports = router;
