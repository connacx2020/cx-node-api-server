import * as express from 'express';
var controllers =  require('../controllers/userController');

var router = express.Router();
router.route('/getUsers')
    .get(controllers.getUsers);
    
module.exports = router;
