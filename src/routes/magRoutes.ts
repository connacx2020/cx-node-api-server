import * as express from 'express';
var controller = require('../controllers/magController');

var router = express.Router();
router.route('/getMonthlyGenderAllEntrance')
    .get(controller.getMonthlyGenderAllEntrance);

router.route('/getMonthlyMoodAllEntrance')
    .get(controller.getMonthlyMoodAllEntrance);

router.route('/getEntranceData')
    .get(controller.getEntranceData);

module.exports = router;
