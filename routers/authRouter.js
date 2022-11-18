import {Router} from 'express';
import {check} from 'express-validator';

import authController from '../controllers/authController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const router = new Router();

router.post(
	'/registration',
	[
		check('name', 'User name cant be empty').notEmpty(),
		check('password', 'Password should be at least one symbol').notEmpty(),
		check('email', 'Enter correct email').isEmail(),
	],
	authController.registration
);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/users', authMiddleware, authController.getUsers);
router.post('/currentUser', authController.getCurrentUser);
router.delete('/users', authMiddleware, authController.deleteUser);

export default router;
