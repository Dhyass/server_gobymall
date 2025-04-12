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

// Ajouter une bannière
export const add_banner = async (req, res) => {
  const { productId } = req.body;
  const banner = req.file;

  if (!productId) {
    return responseReturn(res, 400, { message: "ID du produit requis" });
  }

  if (!banner) {
    return responseReturn(res, 400, { message: "Image de la bannière requise" });
  }

  try {
    // Vérification de l'existence du produit
    const product = await productModel.findOne({
      _id: productId,
      sellerId: req.user.id, // Vérifie l'appartenance du produit
    });

    if (!product) {
      return responseReturn(res, 404, { message: "Produit introuvable ou non autorisé" });
    }

    // Téléchargement de l'image sur Cloudinary
    const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, "_")}/banners`;
    const uploadResult = await cloudinary.uploader.upload(banner.path, {
      folder: folderPath,
      public_id: `${product.slug}-${Date.now()}`,
    });

    // Création de la bannière en base de données
    const bannerImage = await bannerModel.create({
      productId: product._id,
      banner: uploadResult.secure_url,
      link: uploadResult.url,
    });

    return responseReturn(res, 200, {
      message: "Bannière ajoutée avec succès",
      bannerImage,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la bannière :", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur" });
  }
};

export const update_product_banner = async (req, res) => {
    const { bannerId } = req.params;
    const bannerImage = req.file; // Récupère le fichier téléchargé
  
    if (!bannerImage) {
      return responseReturn(res, 400, { message: "Aucune image téléchargée" });
    }
  
    try {
      // Vérifier l'existence de la bannière dans MongoDB
      const banner = await bannerModel.findById(bannerId);
      if (!banner) {
        return responseReturn(res, 404, { message: "Bannière introuvable" });
      }
  
      // Vérifier si le produit lié appartient à l'utilisateur
      const product = await productModel.findOne({
        _id: banner.productId,
        sellerId: req.user.id, // Vérifie le vendeur connecté
      });
  
      if (!product) {
        return responseReturn(res, 403, { message: "Produit non autorisé pour cet utilisateur." });
      }
  
      // Supprimer l'ancienne image de Cloudinary si elle existe
      if (banner.banner) {
        try {
          const oldImagePublicId = banner.banner.split("/").pop().split(".")[0]; // Extraire l'identifiant public
          await cloudinary.uploader.destroy(oldImagePublicId);
        } catch (err) {
          console.error("Erreur lors de la suppression de l'ancienne image Cloudinary :", err);
        }
      }
  
      // Téléverser la nouvelle image sur Cloudinary
      const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, "_")}/banners`;
      const uploadResult = await cloudinary.uploader.upload(bannerImage.path, {
        folder: folderPath,
        public_id: `${product.slug}-${Date.now()}`,
      });
  
      // Vérifier que le téléchargement a réussi
      if (!uploadResult || !uploadResult.url) {
        return responseReturn(res, 500, { message: "Erreur lors du téléversement sur Cloudinary." });
      }
  
      // Mettre à jour la bannière dans MongoDB
      const updatedBanner = await bannerModel.findByIdAndUpdate(
        bannerId,
        { 
            banner: uploadResult.secure_url ,
            link: uploadResult.url,
        },
        { new: true } // Retourne le document mis à jour
      );
  
      if (!updatedBanner) {
        return responseReturn(res, 500, { message: "Échec de la mise à jour dans MongoDB." });
      }
  
      // Envoyer la réponse réussie
      return responseReturn(res, 200, {
        message: "Bannière mise à jour avec succès.",
        banner: updatedBanner,
      });
    } catch (error) {
      console.error("Erreur dans update_product_banner :", error);
      return responseReturn(res, 500, { message: "Erreur interne du serveur." });
    }
  };
  


export const get_product_banners = async (req, res) => {
    const {productId} = req.params
   // console.log('params ',req.params)
   try {
     const banner = await bannerModel.findOne({productId})
     if(!banner){
        return responseReturn(res, 404, { message: "aucun banner trouvé pour ce produit " });
     }
    // console.log('banner ', banner)
     return responseReturn(res, 200, {banner, message: "banner trouvé avec succès."});
   } catch (error) {
    console.log('error ', error);
    return responseReturn(res, 500, { message: "Erreur lors de la recherche du banner ." });
   }
}


export const get_banners = async (req, res) => {
   
   try {
     const banners = await bannerModel.aggregate([
        {
            $sample :{
                size : 10
            }
        }
     ])
    //console.log('banners ', banners)
     return responseReturn(res, 200, {banners});
   } catch (error) {
    console.log('error ', error);
    return responseReturn(res, 500, { message: "Erreur lors de la recherche du banner ." });
   }
}








