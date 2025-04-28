const { Router } = require('express');
const { authController } = require('../controllers/authController');
const authRouter = new Router();



authRouter.post('/signupcos', authController.signupcos);
authRouter.post('/signupwor', authController.signupwor);



module.exports = { authRouter };
