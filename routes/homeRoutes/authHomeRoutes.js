import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    addCustomerAddresses,
    create_seller_account,
    customer_login,
    customer_logout,
    customer_register,
    getCustomerAddresses,
    reset_customer_password,
    send_customer_reset_otp,
    setDefaultCustomerAddress,
    switch_to_seller,
    updateCustomerAddressByIndex,
    verify_customer_reset_otp,
    verifyCustomerAccount
} from '../../controllers/homeControllers/authHomeControllers.js';



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

router.post('/customer/customer_register', customer_register);
router.post('/customer/customer_login', customer_login);
router.post('/customer/logout', customer_logout )
router.get('/customer/verify/:customerId/:otp', verifyCustomerAccount)
router.get('/customer/switch-to-seller/:customerId', switch_to_seller)
router.post(`/customer/send-customer-reset-otp`, send_customer_reset_otp)
router.post(`/customer/verify-customer-reset-otp`, verify_customer_reset_otp)
router.post(`/customer/reset-customer-password`, reset_customer_password)
router.post(`/customer/createSellerAccount`, upload.single('image'), create_seller_account)

////////////////////////////////////////////////////////////////////////////////////////

router.post('/customer/add_customer_addresses/:customerId', addCustomerAddresses)
router.get("/customer/get_customer_addresses/:customerId", getCustomerAddresses);
router.put("/customer/update-customer-address/:customerId", updateCustomerAddressByIndex);
router.put('/customer/set_default_address/:customerId', setDefaultCustomerAddress);



export default router;  //export the router
//export default router; // export the router as a default export
