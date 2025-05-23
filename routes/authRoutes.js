import express from 'express';
import multer from 'multer';
import path from 'path';

import {
    admin_login,
    admin_register,
    getUser,
    logout,
    profile_info_add,
    reset_password,
    seller_login,
    seller_register,
    send_reset_otp,
    switch_to_customer,
    upload_profile_image,
    verify_reset_otp,
    verify_seller_otp
} from '../controllers/authControllers.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';



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

router.post('/admin_login', admin_login);
router.get('/get_user', authMiddleware, getUser);
router.post('/admin_register', admin_register);
router.post('/seller_register', seller_register);
router.post('/seller_login', seller_login);
router.get(`/seller/switch-to-customer`,authMiddleware, switch_to_customer )
router.post(`/seller/verify-otp`, verify_seller_otp)
router.post(`/seller/send-reset-otp`, send_reset_otp)
router.post(`/seller/verify-reset-otp`, verify_reset_otp)
router.post(`/seller/reset-password`, reset_password)
router.get("/logout", logout);
//router.post("/profile/uploadImage", authMiddleware, upload.single("image"),upload_profile_image);
router.post("/profile/uploadImage",  authMiddleware, upload.single("image"), upload_profile_image);
router.post("/profile/seller_infos",  authMiddleware, profile_info_add);

export default router;  //export the router
//export default router; // export the router as a default export
