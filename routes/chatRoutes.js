import express from 'express';
import {
    add_customer_friend,
    admin_message_to_seller,
    customer_message_to_seller,
    get_admin_messages,
    get_customer_messages,
    get_seller_messages,
    getCustomers,
    getSellers,
    seller_message_to_admin,
    seller_message_to_customer
} from '../controllers/chatControllers/chatControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


const router = express.Router();
router.post('/customer/add_customer_friend', add_customer_friend)
router.post('/customer/send_message', customer_message_to_seller)
router.get('/customer/seller/getCustomers/:sellerId', getCustomers)
router.get('/customer/seller/get_customer_messages/:customerId', authMiddleware,get_customer_messages)
router.post('/customer/seller/send_message_to_Customer', seller_message_to_customer)
router.get('/seller/admin/getSellers', authMiddleware, getSellers)
router.post('/seller/admin/admin_message_to_Seller', admin_message_to_seller)
router.post('/admin/admin/seller_message_to_Admin', seller_message_to_admin)
router.get('/seller/admin/get_admin_messages/:receiverId', authMiddleware, get_admin_messages)
router.get('/admin/seller/get_seller_messages', authMiddleware, get_seller_messages)


export default router;  //export the router