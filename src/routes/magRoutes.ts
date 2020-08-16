import * as express from 'express';
var controller = require('../controllers/magController');

var router = express.Router();

router.route('/getMAGByDateTimeRange')
    .get(controller.getMAGByDateTimeRange);

module.exports = router;
