import express from 'express';
import {
    add_customer_friend,
    admin_message_to_seller,
    customer_message_to_seller,
    get_customer_messages,
    getCustomers,
    getSellers,
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


export default router;  //export the router