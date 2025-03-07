import express from 'express';
import multer from 'multer';
import path from 'path';


import { add_banner } from '../../controllers/dashboardControllers/bannerControllers.js';
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
//const upload = multer({ dest: 'uploads/categories' }); // Configurez multer pour le téléchargement

// Route pour l'ajout de catégorie avec auth et upload de fichier
router.post('/banner/add_banner', authMiddleware, upload.single('banners'), add_banner);

//router.post('/banner/add_banner',authMiddleware, add_banner)


export default router;  //export the router