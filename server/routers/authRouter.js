const { Router } = require('express');
const { authController } = require('../controllers/authController');
const authRouter = new Router();



authRouter.post('/signupcos', authController.signupcos);



module.exports = { authRouter };
