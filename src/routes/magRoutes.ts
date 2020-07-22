import * as express from 'express';
var controller =  require('../controllers/magController');

var router = express.Router();
router.route('/mag')
    .get(controller.mag);
    
router.route('/testdb')
    .get(controller.testdb);
module.exports = router;