const { Router } = require('express');
const { authController } = require('../controllers/authController');
const authRouter = new Router();


authRouter.post('/forgetPassword', authController.forgetPassword);
authRouter.post('/resetPassword', authController.resetPassword);



module.exports = { authRouter };
