import { v2 as cloudinary } from 'cloudinary';
import mongoose from "mongoose";
import bannerModel from '../../models/bannerModel.js';
import productModel from '../../models/productModel.js';
import { responseReturn } from '../../utiles/response.js';
const { Types } = mongoose;

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export const add_banner = async (req, res) =>  {
  // console.log('add banner request ', req.file);
   //console.log('poduct id ', req.body.productId);
   const { productId } = req.body;
   const banner = req.file;
   
   try {
        // Recherche du produit par son ID et son sellerId
        const product = await productModel.findOne({
            _id: productId,
            sellerId: req.user.id, // Vérifie que le produit appartient au vendeur connecté
        });
        const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, '_')}/banners`;
        // Téléchargement de l'image sur Cloudinary
        const uploadResult = await cloudinary.uploader.upload(banner.path, {
            folder:folderPath,
            public_id:`${product.slug}-${Date.now()}`
        });
       const bannerImage= await bannerModel.create({
            productId: product._id,
            banner: uploadResult.secure_url,
            link : uploadResult.url
        })
       // console.log('product ', product)
      // console.log('folderPath ', folderPath)
       //console.log('upload Result ', uploadResult)
       return responseReturn(res, 200, { 
                   message: "banner ajouté avec succès.", 
                   bannerImage
               });
   } catch (error) {
    console.log('error ', error.message);
    return responseReturn(res, 500, { message: "Erreur lors de l'ajout du banner." });
   }
};






