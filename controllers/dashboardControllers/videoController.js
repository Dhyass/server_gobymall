

import Product from "../../models/productModel.js";
import ProductVideoModel from "../../models/productVideoModel.js";
import cloudinary from "../../utiles/cloudinary.js";
import { responseReturn } from "../../utiles/response.js";


// Ajouter une vidéo produit
export const add_product_video = async (req, res) => {
  const { productId } = req.body;
  const videoFile = req.file;

  if (!productId) {
    return responseReturn(res, 400, { message: "ID du produit requis" });
  }

  if (!videoFile) {
    return responseReturn(res, 400, { message: "Vidéo requise" });
  }

  try {
    // Vérification de l'existence du produit
    const product = await Product.findOne({
      _id: productId,
      sellerId: req.user.id,
    });

    if (!product) {
      return responseReturn(res, 404, { message: "Produit introuvable ou non autorisé" });
    }

    // --- UPLOAD Cloudinary (VIDEO) ---
    const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, "_")}/videos`;

    const uploadResult = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
      folder: folderPath,
      public_id: `${product.slug}-video-${Date.now()}`,
    });

    const { duration, bytes, format, secure_url, public_id } = uploadResult;

    // --- VALIDATIONS STRICTES (AliExpress Style) ---
    if (duration < 5) {
      return responseReturn(res, 400, { message: "La vidéo doit durer au moins 5 secondes" });
    }

    if (duration > 45) {
      return responseReturn(res, 400, { message: "La vidéo doit durer au maximum 45 secondes" });
    }

    if (bytes > 10 * 1024 * 1024) {
      return responseReturn(res, 400, { message: "La taille maximale de la vidéo est 10MB" });
    }

    const allowedFormats = ["mp4", "webm", "ogg"];
    if (!allowedFormats.includes(format)) {
      return responseReturn(res, 400, {
        message: "Format non supporté. Formats acceptés : mp4, webm, ogg",
      });
    }

    // Supprimer éventuelle ancienne vidéo du produit
    const oldVideo = await ProductVideoModel.findOne({ productId });
    if (oldVideo) {
      try {
        await cloudinary.uploader.destroy(oldVideo.public_id, {
          resource_type: "video",
        });
      } catch (err) {
        console.log("Erreur lors de la suppression de l'ancienne vidéo :", err);
      }
      await ProductVideoModel.deleteOne({ productId });
    }

    // --- ENREGISTREMENT EN BASE ---
    const videoData = await ProductVideoModel.create({
      productId: product._id,
      sellerId: req.user.id,
      url: secure_url,
      public_id,
      duration,
      size: bytes,
      format,
    });

    return responseReturn(res, 200, {
      message: "Vidéo ajoutée avec succès",
      video: videoData,
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout de la vidéo :", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur" });
  }
};


export const update_product_video = async (req, res) => {
  const { productId } = req.params;
  const videoFile = req.file;

  if (!videoFile) {
    return responseReturn(res, 400, { message: "Aucune vidéo fournie" });
  }

  try {
    // Vérifier l'existence du produit
    const product = await productModel.findOne({
      _id: productId,
      sellerId: req.user.id,
    });

    if (!product) {
      return responseReturn(res, 404, { message: "Produit introuvable ou non autorisé" });
    }

    // Vérifier si une vidéo existe déjà
    const oldVideo = await productVideoModel.findOne({ productId });

    // Upload Cloudinary
    const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, "_")}/videos`;

    const uploadResult = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
      folder: folderPath,
      public_id: `${product.slug}-video-${Date.now()}`,
    });

    const { duration, bytes, format, secure_url, public_id } = uploadResult;

    // ───── VALIDATIONS AliExpress ─────
    if (duration < 5) {
      return responseReturn(res, 400, { message: "La vidéo doit durer au moins 5 secondes" });
    }

    if (duration > 45) {
      return responseReturn(res, 400, { message: "La vidéo doit durer au maximum 45 secondes" });
    }

    if (bytes > 10 * 1024 * 1024) {
      return responseReturn(res, 400, { message: "La taille maximale de la vidéo est 10MB" });
    }

    const allowedFormats = ["mp4", "webm", "ogg"];
    if (!allowedFormats.includes(format)) {
      return responseReturn(res, 400, {
        message: "Format non supporté. Formats acceptés : mp4, webm, ogg",
      });
    }

    // Suppression ancienne vidéo
    if (oldVideo) {
      try {
        await cloudinary.uploader.destroy(oldVideo.public_id, { resource_type: "video" });
      } catch (err) {
        console.log("Erreur suppression ancienne vidéo :", err);
      }
      await ProductVideoModel.deleteOne({ productId });
    }

    // Mise à jour DB
    const updatedVideo = await ProductVideoModel.create({
      productId: product._id,
      sellerId: req.user.id,
      url: secure_url,
      public_id,
      duration,
      size: bytes,
      format,
    });

    return responseReturn(res, 200, {
      message: "Vidéo mise à jour avec succès",
      video: updatedVideo,
    });

  } catch (error) {
    console.error("Erreur update video :", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur" });
  }
};



export const get_product_video = async (req, res) => {
  const { productId } = req.params;

 // console.log("produit id", productId)

  try {
    const video = await ProductVideoModel.findOne({ productId });

    if (!video) {
      return responseReturn(res, 404, { message: "Aucune vidéo trouvée pour ce produit" });
    }

    return responseReturn(res, 200, {
      message: "Vidéo trouvée",
      video,
    });

  } catch (error) {
    console.log("Erreur get_product_video :", error);
    return responseReturn(res, 500, { message: "Erreur serveur" });
  }
};


export const get_videos = async (req, res) => {
  try {
    const videos = await ProductVideoModel.aggregate([
      { $sample: { size: 10 } }
    ]);

    return responseReturn(res, 200, { videos });
  } catch (error) {
    console.log("Erreur get_videos :", error);
    return responseReturn(res, 500, { message: "Erreur serveur" });
  }
};
