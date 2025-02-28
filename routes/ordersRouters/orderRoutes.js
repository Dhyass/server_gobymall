import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    admin_order_status_update,
    create_payment,
    get_admin_order_by_ID,
    get_admin_orders,
    get_dashboard_data,
    get_order_by_id,
    get_orders,
    get_seller_order_by_ID,
    get_seller_orders,
    order_confirm,
    place_order,
    seller_order_status_update
} from '../../controllers/ordersControllers/orderControllers.js';



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
router.post('/order/create-payment', create_payment)
router.get('/order/confirm/:orderId', order_confirm)

router.get('/order/admin/get_admin_orders', get_admin_orders)
router.get('/order/admin/get_admin_order/:orderId', get_admin_order_by_ID);
router.put('/order/admin/admin_order_status_update/:orderId',admin_order_status_update)

router.get('/order/seller/get_seller_orders/:sellerId', get_seller_orders)
router.get('/order/seller/get_seller_order/:orderId', get_seller_order_by_ID);
router.put('/order/seller/seller_order_status_update/:orderId',seller_order_status_update)





export default router;  //export the router
//export default router; // export the router as a default export
