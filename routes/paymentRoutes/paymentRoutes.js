import express from 'express';
import multer from 'multer';
import path from 'path';
import { active_stripe_connect_account, create_stripe_connect_account, get_seller_payment_details, send_withdrawal_request } from '../../controllers/paymentControllers/paymentController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';



const router = express.Router();

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    /* destination: (req, file, cb) => {
         console.log("path ",path.resolve('uploads/categories'));
         cb(null, path.resolve('uploads/categories')); // Utilise un chemin absolu
     },*/
     filename: (req, file, cb) => {
         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
         cb(null, uniqueSuffix + path.extname(file.originalname));
     }
 });
 
 
 // Optionnel : Filtrage des fichiers pour n'accepter que les images
 const fileFilter = (req, file, cb) => {
     if (file.mimetype.startsWith('image/')) {
         cb(null, true);
     } else {
         cb(new Error('Seuls les fichiers d\'image sont autorisés'), false);
     }
 };
 const upload = multer({ storage, fileFilter });

router.get('/seller/payment/create_stripe_account', authMiddleware,create_stripe_connect_account);
router.put('/seller/payment/active_stripe_account/:activeCode', authMiddleware,active_stripe_connect_account);

router.get('/seller/payment/seller_payment_details/:sellerId', authMiddleware,get_seller_payment_details);

router.post('/seller/payment/send_withdrawal_request', authMiddleware,send_withdrawal_request);


export default router;  //export the router
// /seller/payment/send_withdrawal_request
