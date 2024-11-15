import express from 'express';
import {
    admin_login,
    admin_register,
    getUser,
    logout,
    seller_login,
    seller_register,
} from '../controllers/authControllers.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/admin_login', admin_login);
router.get('/get_user', authMiddleware, getUser);
router.post('/admin_register', admin_register);
router.post('/seller_register', seller_register);
router.post('/seller_login', seller_login);
router.post("/logout", logout);
export default router;  //export the router
//export default router; // export the router as a default export
