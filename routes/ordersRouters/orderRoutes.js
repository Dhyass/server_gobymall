import express from 'express';
import multer from 'multer';
import path from 'path';
import { get_dashboard_data, get_order_by_id, get_orders, place_order } from '../../controllers/ordersControllers/orderControllers.js';



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

router.post('/order/place_order', place_order);
router.get('/order/get_order/:customerId/:status', get_orders);
router.get('/customer/get_dashboard_data/:customerId',get_dashboard_data)
router.get('/order/get_order_by_id/:orderId', get_order_by_id);




export default router;  //export the router
//export default router; // export the router as a default export
