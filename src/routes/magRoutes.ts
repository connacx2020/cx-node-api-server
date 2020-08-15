import * as express from 'express';
var controller = require('../controllers/magController');

var router = express.Router();
router.route('/getMonthlyGenderAllEntrance')
    .get(controller.getMonthlyGenderAllEntrance);

router.route('/getMonthlyMoodAllEntrance')
    .get(controller.getMonthlyMoodAllEntrance);

router.route('/getEntranceData')
    .get(controller.getEntranceData);

router.route('/getMonthlyMoodPercentAllEntrance')
    .get(controller.getMonthlyMoodPercentAllEntrance);

router.route('/getMonthlyGenderPercentAllEntrance')
    .get(controller.getMonthlyGenderPercentAllEntrance);

router.route('/getMonthlyAgePercentAllEntrance')
    .get(controller.getMonthlyAgePercentAllEntrance);

router.route('/getMAGByDateTimeRange')
    .get(controller.getMAGByDateTimeRange);

module.exports = router;
