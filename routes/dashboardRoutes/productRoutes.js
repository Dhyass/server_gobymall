import express from 'express';
import multer from 'multer';
import path from 'path';

import {
    add_product,
    delete_product,
    get_category_tags,
    get_product_by_id,
    get_products,
    updateProduct
} from '../../controllers/dashboardControllers/productControllers.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    /*
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
    */
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

const uploadMultiple = upload.fields([
  { name: 'images[]', maxCount: 10 },
  { name: 'variantImage', maxCount: 20 }  // Autorise jusqu’à 20 images de variantes
]);

const uploadMultipleUpdate = upload.fields([
  { name: 'newImages[]', maxCount: 5 },
  { name: 'variantImage', maxCount: 20 }  // Autorise jusqu’à 20 images de variantes
]);



// Route avec le middleware d'authentification et de téléchargement de fichiers

//router.post('/product_add', authMiddleware, upload.array('images[]'),upload.single('variantImage'), add_product);
 
router.post('/product_add',authMiddleware, uploadMultiple,add_product);

router.get('/products/products_get', authMiddleware, get_products);
router.get('/products/get_product_by_id/:id', authMiddleware, get_product_by_id);
router.delete('/product/delete/:id', authMiddleware, delete_product);
//router.put('/product/update', authMiddleware, upload.array('newImages[]',4), updateProduct);
router.put('/product/update', authMiddleware, uploadMultipleUpdate, updateProduct);

router.get('/product/tags', get_category_tags);

export default router;
