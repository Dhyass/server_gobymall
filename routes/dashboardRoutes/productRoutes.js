import express from 'express';
import multer from 'multer';
import path from 'path';

import {
    add_product,
    delete_product,
    edit_product,
    get_product
} from '../../controllers/dashboardControllers/productControllers.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
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

// Initialisation de multer avec le stockage et filtrage optionnel
const upload = multer({ storage, fileFilter });

// Route avec le middleware d'authentification et de téléchargement de fichiers

router.post('/product_add', authMiddleware, upload.array('images[]',4), add_product);
 

router.get('/product_get', authMiddleware, get_product);
router.post('/product_delete', authMiddleware, delete_product);
router.post('/product_edit', authMiddleware, edit_product);

export default router;
