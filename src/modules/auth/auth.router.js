import { Router } from 'express';
import { registerHandler, loginHandler, refreshHandler, meHandler, logoutHandler } from './auth.controller.js';
import { authMiddleware } from './auth.middleware.js';

const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/refresh', refreshHandler);
router.get('/me', authMiddleware, meHandler);
router.post('/logout', logoutHandler);

export default router;
