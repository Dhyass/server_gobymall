import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    add_to_card, add_to_wishlist, delete_card_product, delete_wishlist_product, get_card, get_wishlist_products,
    recalculateCart, update_product_quantity
} from '../../controllers/homeControllers/cardControllers.js';




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

router.post('/card/add_to_card', add_to_card);
router.get('/card/product/:id', get_card);
router.delete("/card/delete_product/:cardId", delete_card_product)
router.put('/card/update_product_quantity/:cardId', update_product_quantity);
router.post('/wishlist/add_to_wishlist', add_to_wishlist);
router.get('/wishlist/get_wishlist_products/:customerId', get_wishlist_products);
router.delete('/wishlist/remove_wishlist_product/:wishlistId', delete_wishlist_product);
router.post('/cart/recalculate', recalculateCart)



export default router;  //export the router
//export default router; // export the router as a default export
