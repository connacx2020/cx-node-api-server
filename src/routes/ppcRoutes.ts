import * as express from 'express';
var controller = require('../controllers/ppcController');

var router = express.Router();
router.route('/getAllEntranceMonthlyPPC')
    .get(controller.getAllEntranceMonthlyPPC);

router.route('/getEastEntranceMonthlyPPC')
    .get(controller.getEastEntranceMonthlyPPC);

router.route('/getWestEntranceMonthlyPPC')
    .get(controller.getWestEntranceMonthlyPPC);

router.route('/getCircleEntranceMonthlyPPC')
    .get(controller.getCircleEntranceMonthlyPPC);

router.route('/getB2EntranceMonthlyPPC')
    .get(controller.getB2EntranceMonthlyPPC);

module.exports = router;
