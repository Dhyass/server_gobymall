import express from 'express';


import { get_seller_by_id, get_seller_request, seller_status_update } from '../../controllers/dashboardControllers/sellerController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

 

router.get('/seller_request_get', authMiddleware, get_seller_request);
router.get('/seller_infos_get/:id', authMiddleware, get_seller_by_id);
router.post('/update/seller_status', authMiddleware, seller_status_update);

export default router;
