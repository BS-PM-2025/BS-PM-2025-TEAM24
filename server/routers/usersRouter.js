const { Router } = require('express');
const { usersController } = require('../controllers/usersController');
const usersRouter = new Router();


usersRouter.get('/:id', usersController.getUserDetails);  
usersRouter.put('/:id/updateUser', usersController.editUserDetails);
usersRouter.put('/:id/updatePassword', usersController.updatePassword);

module.exports = { usersRouter };
