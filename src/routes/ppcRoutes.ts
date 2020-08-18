import * as express from 'express';
var controller = require('../controllers/ppcController');
const { authenticateJWT } = require('../utils/jwt');

var router = express.Router();

router.route('/getPPCByDateTimeRange')
    //.get(authenticateJWT)
    .get(controller.getPPCByDateTimeRange);

module.exports = router;
