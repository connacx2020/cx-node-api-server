import * as express from 'express';
var controller = require('../controllers/authController');

var router = express.Router();

router.route('/login')
    .post(controller.login);

module.exports = router;