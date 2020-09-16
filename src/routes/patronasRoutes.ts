import * as express from 'express';
var controller = require('../controllers/patronasController');
const { authenticateJWT } = require('../utils/jwt');

var router = express.Router();

router.route('/getPatronasData')
    // .get(authenticateJWT)
    .get(controller.getPatronasDataFromCsv);

module.exports = router;
