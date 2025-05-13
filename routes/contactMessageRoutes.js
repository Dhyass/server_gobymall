import express from 'express';
import { sendContactMessage } from '../controllers/contactMessageControllers.js/contactMessageController.js';


const router = express.Router();

router.post('/contact', sendContactMessage)



export default router;  //export the router