import {Router} from 'express';

import statusController from '../controllers/statusController.js';

const router = new Router();

router.patch('/block', statusController.blockStatus);
router.patch('/unblock', statusController.activeStatus);

export default router;
