import * as express from 'express';
var controller = require('../controllers/userController');

var router = express.Router();

router.route('/register')
    .post(controller.register);

router.route('/validateToken')
    .post(controller.validateToken);

router.route('/login')
    .post(controller.login);

module.exports = router;
