import cloudinary from "cloudinary";
import fs from 'fs';
import productModel from '../../models/productModel.js';
// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

/*
export const add_product = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { name, description, discount, price, brand, stock, category, shopName } = req.body;

        const trimmedName = name.trim();
        const slug = trimmedName.split(' ').join('-');

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Aucune image téléchargée" });
        }

        // Dossier de destination avec nettoyage des espaces
        const folderPath = `GOBYMALL/${shopName.trim().replace(/\s+/g, '_')}/${category.trim().replace(/\s+/g, '_')}`;
        console.log("folderpath", folderPath);

        const uploadPromises = req.files.map(file =>
            cloudinary.uploader.upload(file.path, {
                folder: folderPath,
                public_id: `${slug}-${Date.now()}`
            }).then(result => {
                // Supprimer le fichier temporaire après upload
                fs.unlinkSync(file.path);
                return {
                    url: result.secure_url,
                    public_id: result.public_id
                };
            })
        );

        const images = await Promise.all(uploadPromises);

        const product = await productModel.create({
            sellerId: req.user.id,
            name: trimmedName,
            slug,
            description: description.trim(),
            discount: parseInt(discount),
            price: parseFloat(price),
            brand: brand.trim(),
            stock: parseInt(stock),
            category: category.trim(),
            shopName: shopName.trim(),
            images
        });

        res.status(200).json({
            message: "Produit ajouté avec succès",
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du produit :", error);
        res.status(500).json({ message: "Erreur lors de l'ajout du produit" });
    }
};
*/

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export const add_product = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { name, description, discount, price, brand, stock, category, shopName } = req.body;

        const trimmedName = name.trim();
        const slug = trimmedName.split(' ').join('-');

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Aucune image téléchargée" });
        }

        const folderPath = `GOBYMALL/${shopName.trim().replace(/\s+/g, '_')}/${category.trim().replace(/\s+/g, '_')}`;
        console.log("Chemin du dossier Cloudinary :", folderPath);

        // Upload des fichiers vers Cloudinary
        let images = [];
        const uploadPromises = req.files.map(file =>
            cloudinary.uploader.upload(file.path, {
                folder: folderPath,
                public_id: `${slug}-${Date.now()}`
            }).then(result => {
                fs.promises.unlink(file.path); // Suppression asynchrone des fichiers temporaires
                return {
                    url: result.secure_url,
                    public_id: result.public_id
                };
            })
        );

        try {
            const uploadResults = await Promise.all(uploadPromises);
            images = uploadResults;
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
            return res.status(500).json({ message: "Erreur lors de l'upload des fichiers." });
        }

        // Création du produit
        const product = await productModel.create({
            sellerId: req.user.id,
            name: trimmedName,
            slug,
            description: description.trim(),
            discount: parseInt(discount),
            price: parseFloat(price),
            brand: brand.trim(),
            stock: parseInt(stock),
            category: category.trim(),
            shopName: shopName.trim(),
            images
        });

        res.status(200).json({
            message: "Produit ajouté avec succès",
            product
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du produit :", error);
        res.status(500).json({ message: "Erreur lors de l'ajout du produit" });
    }
};




export const get_product = async (req, res) =>  {
    console.log('get product is ready')
};




export const delete_product = async (req, res) =>  {
    console.log('delete product is ready')
 
}

export const edit_product = async (req, res) =>  {
    console.log('edit product is ready')
 
}

/*
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const uploadMiddleware = (req, res, next) => {
  // Use multer upload instance
  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = req.files;
    const errors = [];

    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = uploadMiddleware;
*/