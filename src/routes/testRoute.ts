import * as express from 'express';
var controller = require('../controllers/testController');

var router = express.Router();

router.route('/hello')
    // .get(authenticateJWT)
    .get(controller.hello);

module.exports = router;