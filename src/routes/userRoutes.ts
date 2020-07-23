import * as express from 'express';
var controller =  require('../controllers/userController');

var router = express.Router();

router.route('/register')
    .post(controller.register);

router.route('/testdb')
    .get(controller.testdb);
    
module.exports = router;
