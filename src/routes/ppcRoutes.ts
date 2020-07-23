import * as express from 'express';
var controller =  require('../controllers/ppcController');

var router = express.Router();
router.route('/ppc')
    .get(controller.ppc);

module.exports = router;
