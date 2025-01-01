import express from 'express';
import {
    add_customer_friend,
    getCustomers,
    send_message_to_seller
} from '../controllers/chatControllers/chatControllers.js';


const router = express.Router();
router.post('/customer/add_customer_friend', add_customer_friend)
router.post('/customer/send_message', send_message_to_seller)
router.get('/customer/seller/getCustomers/:sellerId', getCustomers)


export default router;  //export the router