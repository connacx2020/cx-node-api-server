import * as express from 'express';
var controller = require('../controllers/magController');
const { authenticateJWT } = require('../utils/jwt');

var router = express.Router();

router.route('/getMAGByDateTimeRange')
    // .get(authenticateJWT)
    .get(controller.getMAGByDateTimeRange);

module.exports = router;
