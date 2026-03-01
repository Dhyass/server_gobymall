
import fs from 'fs';
import mongoose from 'mongoose';
import qs from 'qs';

import productModel from '../../models/productModel.js';
import cloudinary from '../../utiles/cloudinary.js';
import { responseReturn } from '../../utiles/response.js';

/*
export const add_product = async (req, res) => {
  try {
    const parsedBody = qs.parse(req.body);

    if (!req.user || !req.user.id) {
      return responseReturn(res, 401, { message: "Utilisateur non authentifié." });
    }

    const {
      name,
      description,
      discount,
      price,
      brand,
      stock,
      category,
      shopName,
      tags,
      deliveryType,
      deliveryFee,
      estimatedDeliveryTime,
      weight,
      dimensions,
      variants,
    } = parsedBody;

    if (!name || !price || !stock || !category || !shopName) {
      return responseReturn(res, 400, { message: "Champs obligatoires manquants." });
    }

    const trimmedName = name.trim();
    const slug = trimmedName.split(" ").join("-").toLowerCase();

    //  Gestion des images produit
    const productImages = req.files['images[]'] || [];
    if (productImages.length === 0) {
      return responseReturn(res, 400, { message: "Au moins une image produit est requise." });
    }
    if (productImages.length > 4) {
      return responseReturn(res, 400, { message: "Maximum 4 images produit autorisées." });
    }

    const folderPath = `GOBYMALL/${shopName.trim().replace(/\s+/g, '_')}/${category.trim().replace(/\s+/g, '_')}`;
    const imageUploads = await Promise.allSettled(
      productImages.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: folderPath,
          public_id: `${slug}-${Date.now()}`
        }).then(result => {
          fs.promises.unlink(file.path).catch(console.error);
          return { url: result.secure_url, public_id: result.public_id };
        })
      )
    );

    const images = imageUploads.filter(r => r.status === "fulfilled").map(r => r.value);
    if (images.length !== productImages.length) {
      return responseReturn(res, 400, { message: "Erreur lors de l'upload des images produit." });
    }

    // ✅ Tags
    const normalizedTags = Array.isArray(tags) ? tags : tags ? [tags] : [];

    // ✅ Variantes
    const variantImages = req.files['variantImage'] || [];
    const normalizedVariants = [];

    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];

        const stockValue = parseInt(variant.variantStock);
        if (isNaN(stockValue)) {
          return responseReturn(res, 400, { message: `Le stock est obligatoire pour la variante ${i + 1}.` });
        }

        let variantPrice = parseFloat(variant.variantPrice);
        if (isNaN(variantPrice) || variantPrice <= 0) {
          variantPrice = parseFloat(price);
        }

        let variantImageUrl = "";

        if (variantImages[i]) {
          const uploadResult = await cloudinary.uploader.upload(variantImages[i].path, {
            folder: `${folderPath}/variants`,
            public_id: `${slug}-variant-${i}-${Date.now()}`
          });
          variantImageUrl = uploadResult.secure_url;
          await fs.promises.unlink(variantImages[i].path).catch(console.error);
        }

        normalizedVariants.push({
          color: variant.color,
          size: variant.size,
          variantPrice,
          variantStock: stockValue,
          variantImage: variantImageUrl
        });
      }
    }

    ///

    // ✅ Création du produit
    const product = await productModel.create({
      sellerId: req.user.id,
      name: trimmedName,
      slug,
      description: description.trim(),
      discount: parseFloat(discount) || 0,
      price: parseFloat(price),
      brand: brand.trim(),
      stock: parseInt(stock),
      category: category.trim(),
      shopName: shopName.trim(),
      images,
      tags: normalizedTags,
      variants: normalizedVariants,
      deliveryType,
      deliveryFee: parseFloat(deliveryFee) || 0,
      estimatedDeliveryTime: estimatedDeliveryTime?.trim(),
      weight: parseFloat(weight) || undefined,
      dimensions: dimensions ? {
        length: parseFloat(dimensions.length) || 0,
        width: parseFloat(dimensions.width) || 0,
        height: parseFloat(dimensions.height) || 0,
      } : undefined,
    });

    console.log('✅ Produit créé avec succès :', product);

    return responseReturn(res, 200, {
      message: "Produit ajouté avec succès.",
      product
    });

  } catch (error) {
    console.error("❌ Erreur add_product :", error);
    return responseReturn(res, 500, { message: "Erreur interne lors de l'ajout du produit.", error: error.message });
  }
};
*/

/*
export const add_product = async (req, res) => {
  try {
    const parsedBody = qs.parse(req.body);

    if (!req.user || !req.user.id) {
      return responseReturn(res, 401, { message: "Utilisateur non authentifié." });
    }

    const {
      name,
      description,
      discount,
      price,
      brand,
      stock,
      category,
      shopName,
      tags,
      deliveryType,
      deliveryFee,
      estimatedDeliveryTime,
      weight,
      dimensions,
      variants,
    } = parsedBody;

    if (!name || !price || !stock || !category || !shopName) {
      return responseReturn(res, 400, { message: "Champs obligatoires manquants." });
    }

    const trimmedName = name.trim();
    const slug = trimmedName.split(" ").join("-").toLowerCase();

    // ✅ Images produit
    const productImages = req.files['images[]'] || [];
    if (productImages.length === 0) {
      return responseReturn(res, 400, { message: "Au moins une image produit est requise." });
    }
    if (productImages.length > 4) {
      return responseReturn(res, 400, { message: "Maximum 4 images produit autorisées." });
    }

    const folderPath = `GOBYMALL/${shopName.trim().replace(/\s+/g, '_')}/${category.trim().replace(/\s+/g, '_')}`;
    const imageUploads = await Promise.allSettled(
      productImages.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: folderPath,
          public_id: `${slug}-${Date.now()}`
        }).then(result => {
          fs.promises.unlink(file.path).catch(console.error);
          return { url: result.secure_url, public_id: result.public_id };
        })
      )
    );

    const images = imageUploads.filter(r => r.status === "fulfilled").map(r => r.value);
    if (images.length !== productImages.length) {
      return responseReturn(res, 400, { message: "Erreur lors de l'upload des images produit." });
    }

    // ✅ Tags
    const normalizedTags = Array.isArray(tags) ? tags : tags ? [tags] : [];

    // ✅ Variantes avec id et image structurée
    const variantImages = req.files['variantImage'] || [];
    const normalizedVariants = [];

    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];

        const stockValue = parseInt(variant.variantStock);
        if (isNaN(stockValue)) {
          return responseReturn(res, 400, { message: `Le stock est obligatoire pour la variante ${i + 1}.` });
        }

        let variantPrice = parseFloat(variant.variantPrice);
        if (isNaN(variantPrice) || variantPrice <= 0) {
          variantPrice = parseFloat(price);
        }

        let variantImage = null;
        if (variantImages[i]) {
          const uploadResult = await cloudinary.uploader.upload(variantImages[i].path, {
            folder: `${folderPath}/variants`,
            public_id: `${slug}-variant-${i}-${Date.now()}`
          });

          await fs.promises.unlink(variantImages[i].path).catch(console.error);
          variantImage = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            _id: new mongoose.Types.ObjectId()
          };
        }

        normalizedVariants.push({
          _id: new mongoose.Types.ObjectId(),
          color: variant.color,
          size: variant.size,
          variantPrice,
          variantStock: stockValue,
          variantImage
        });
      }
    }

    // ✅ Création du produit
    const product = await productModel.create({
      sellerId: req.user.id,
      name: trimmedName,
      slug,
      description: description?.trim(),
      discount: parseFloat(discount) || 0,
      price: parseFloat(price),
      brand: brand?.trim(),
      stock: parseInt(stock),
      category: category.trim(),
      shopName: shopName.trim(),
      images,
      tags: normalizedTags,
      variants: normalizedVariants,
      deliveryType,
      deliveryFee: parseFloat(deliveryFee) || 0,
      estimatedDeliveryTime: estimatedDeliveryTime?.trim(),
      weight: parseFloat(weight) || undefined,
      dimensions: dimensions ? {
        length: parseFloat(dimensions.length) || 0,
        width: parseFloat(dimensions.width) || 0,
        height: parseFloat(dimensions.height) || 0,
      } : undefined,
    });

   // console.log('✅ Produit créé avec succès :', product);

    return responseReturn(res, 200, {
      message: "Produit ajouté avec succès.",
      product
    });

  } catch (error) {
    console.error("❌ Erreur add_product :", error);
    return responseReturn(res, 500, { message: "Erreur interne lors de l'ajout du produit.", error: error.message });
  }
};
*/

export const add_product = async (req, res) => {
  try {
    const parsedBody = qs.parse(req.body);

   // console.log("parse body", parsedBody)

    if (!req.user || !req.user.id) {
      return responseReturn(res, 401, { message: "Utilisateur non authentifié." });
    }

    const {
      name,
      description,
      discount,
      price,
      brand,
      stock,
      category,
      shopName,
      tags,
      productCondition,
      deliveryType,
      deliveryFee,
      estimatedDeliveryTime,
      weight,
      dimensions,
      variants,
    } = parsedBody;

    if (!name || !price || !stock || !category || !shopName || !productCondition) {
      return responseReturn(res, 400, { message: "Champs obligatoires manquants." });
    }

    const trimmedName = name.trim();
    const slug = trimmedName.split(" ").join("-").toLowerCase();
    const folderPath = `GOBYMALL/${shopName.trim().replace(/\s+/g, '_')}/${category.trim().replace(/\s+/g, '_')}`;

    //  Upload images produit
    const productImages = req.files['images[]'] || [];
    if (productImages.length === 0) {
      return responseReturn(res, 400, { message: "Au moins une image produit est requise." });
    }
    if (productImages.length > 4) {
      return responseReturn(res, 400, { message: "Maximum 4 images produit autorisées." });
    }

    const imageUploads = await Promise.allSettled(
      productImages.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: folderPath,
          public_id: `${slug}-${Date.now()}`
        }).then(result => {
          fs.promises.unlink(file.path).catch(console.error);
          return { url: result.secure_url, public_id: result.public_id };
        })
      )
    );

    const images = imageUploads.filter(r => r.status === "fulfilled").map(r => r.value);
    if (images.length !== productImages.length) {
      return responseReturn(res, 400, { message: "Erreur lors de l'upload des images produit." });
    }

    //  Tags
    const normalizedTags = Array.isArray(tags) ? tags : tags ? [tags] : [];

    //  Traitement des variantes avec ObjectId + image liée
    const variantImages = req.files['variantImage'] || [];
    const normalizedVariants = [];

   // console.log('variant Images', variantImages);

 if (Array.isArray(variants) && variants.length > 0) {
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];

    // 🟢 Utiliser l’_id transmis par le frontend
    const variantId = variant._id;
    if (!variantId) {
      return responseReturn(res, 400, { message: `L'identifiant de la variante ${i + 1} est requis.` });
    }

   // console.log('variant id ', variantId);
   // console.log('variant ', variant);

    const stockValue = parseInt(variant.variantStock);
    if (isNaN(stockValue)) {
      return responseReturn(res, 400, { message: `Le stock est requis pour la variante ${i + 1}.` });
    }

    const variantPrice = parseFloat(variant.variantPrice) > 0
      ? parseFloat(variant.variantPrice)
      : parseFloat(price);

    // 🟢 Associer le fichier dont le nom contient l’_id (renommé côté frontend)
    
    const matchedImage = variantImages.find(file =>
    file.originalname?.includes(variantId.toString())
    );


   // console.log('matched image', matchedImage);

    let variantImage = null;
    if (matchedImage) {
      const uploadResult = await cloudinary.uploader.upload(matchedImage.path, {
        folder: `${folderPath}/variants`,
        public_id: `${slug}-variant-${variantId}-${Date.now()}`
      });

      await fs.promises.unlink(matchedImage.path).catch(console.error);

      variantImage = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        _id: new mongoose.Types.ObjectId()
      };
    }

    normalizedVariants.push({
      _id: variantId,
      color: variant.color,
      size: variant.size,
      variantPrice,
      variantStock: stockValue,
      variantImage
    });
  }
}

    //  Création du produit
    const product = await productModel.create({
      sellerId: req.user.id,
      name: trimmedName,
      slug,
      description: description?.trim(),
      discount: parseFloat(discount) || 0,
      price: parseFloat(price),
      brand: brand?.trim(),
      stock: parseInt(stock),
      category: category.trim(),
      shopName: shopName.trim(),
      productCondition,
      images,
      tags: normalizedTags,
      variants: normalizedVariants,
      deliveryType,
      deliveryFee: parseFloat(deliveryFee) || 0,
      estimatedDeliveryTime: estimatedDeliveryTime?.trim(),
      weight: parseFloat(weight) || undefined,
      dimensions: dimensions ? {
        length: parseFloat(dimensions.length) || 0,
        width: parseFloat(dimensions.width) || 0,
        height: parseFloat(dimensions.height) || 0,
      } : undefined,
    });

    return responseReturn(res, 200, {
      message: "Produit ajouté avec succès.",
      product
    });

  } catch (error) {
    console.error("❌ Erreur add_product :", error);
    return responseReturn(res, 500, { message: "Erreur interne lors de l'ajout du produit.", error: error.message });
  }
};


export const get_products = async (req, res) => {
    //console.log(req.query);
    const { page = 1, searchValue = '', parPage = 10 } = req.query;
    const itemsPerPage = parseInt(parPage, 10);
    const skipPage = itemsPerPage * (parseInt(page, 10) - 1);

    try {
        // Construire la requête
        let query = { sellerId: req.user.id }; // Toujours inclure le filtre sellerId
        if (searchValue.trim()) {
            query.$text = { $search: searchValue.trim() }; // Ajouter la recherche textuelle si nécessaire
        }

        //console.log("Query construite :", query); // Vérifier la requête
        //console.log("Seller ID :", req.user.id); // Vérifier l'utilisateur

        // Rechercher les produits
        const products = await productModel.find(query)
            .skip(skipPage)
            .limit(itemsPerPage)
            .sort({ createdAt: -1 });

        // Logs pour debugging
        //console.log("Type de produits :", Array.isArray(products));
        //console.log("Valeur de produit :", products);

        if (!products || products.length === 0) {
            return responseReturn(res, 404, { message: "Aucun produit trouvé." });
        }

        products.forEach(product => {
            if (!product.images || product.images.length === 0) {
                console.error(`Produit sans images détecté : ${product._id}`);
            }
        });

        // Compter les produits
        const totalProduct = await productModel.countDocuments(query);

        // Retourner les résultats
        responseReturn(res, 200, { products, totalProduct });
    } catch (error) {
        console.error("Erreur de chargement de produits ", error.message);
        responseReturn(res, 500, { message: "An error occurred while retrieving products." });
    }
};

/////////////////////////////////////////////////////////////////////////
export const get_product_by_id = async (req, res) => {
    const { id } = req.params; // Récupérer l'id du produit depuis les paramètres de la requête
   // console.log('product id  ' , id);

    try {
        // Recherche du produit par son ID et son sellerId
        const product = await productModel.findOne({
            _id: id,
            sellerId: req.user.id, // Vérifie que le produit appartient au vendeur connecté
        });

       // console.log(product)

        // Si le produit n'existe pas
        if (!product) {
            return responseReturn(res, 404, { message: "Product not found or unauthorized." });
        }

        // Retourner le produit
       return  responseReturn(res, 200, { product });
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error.message);
        
        // Gérer les erreurs (par ex., mauvaise structure d'id ou problème serveur)
        if (error.name === "CastError") {
            return responseReturn(res, 400, { message: "Invalid product ID format." });
        }

        responseReturn(res, 500, { message: "An error occurred while retrieving the product." });
    }
};


export const get_all_product= async (req, res) =>  {
  //  console.log(req.query);
    const { page = 1, searchValue = '', parPage = 10 } = req.query;
    const itemsPerPage = parseInt(parPage, 10);
    const skipPage = itemsPerPage * (parseInt(page, 10) - 1);

    try {
        let query = {};
        if (searchValue.trim()) {
            query = { $text: { $search: searchValue.trim() }, 
        };
        }

        const products = await productModel.find(query)
            .skip(skipPage)
            .limit(itemsPerPage)
            .sort({ createdAt: -1 });
        
        const totalProduct = await productModel.countDocuments(query);

       //console.log("Type de produits :", Array.isArray(products)); // Vérification du type
       //console.log("Valeur de produit :", products); // Vérification de la valeur

        responseReturn(res, 200, { products, totalProduct});
    } catch (error) {
        console.error("Erreur de chargement de produits ",error.message);
        responseReturn(res, 500, { message: "An error occurred while retrieving products." });
    }
};

/*
export const updateProduct = async (req, res) => {
  try {
    const parsedBody = qs.parse(req.body);

    const {
      productId,
      name,
      description,
      discount,
      price,
      brand,
      stock,
      category,
      shopName,
      tags,
      deliveryType,
      deliveryFee,
      estimatedDeliveryTime,
      weight,
      dimensions,
      variants,
      removedImages,
    } = parsedBody;

    if (!productId) return responseReturn(res, 400, { message: "ID du produit requis." });

    const product = await productModel.findById(productId);
    if (!product) return responseReturn(res, 404, { message: "Produit introuvable." });

    // ✅ Mise à jour des champs principaux
    product.name = name?.trim() || product.name;
    product.slug = name ? name.trim().split(' ').join('-').toLowerCase() : product.slug;
    product.description = description || product.description;
    product.discount = discount !== undefined ? parseFloat(discount) : product.discount;
    product.price = price !== undefined ? parseFloat(price) : product.price;
    product.brand = brand || product.brand;
    product.stock = stock !== undefined ? parseInt(stock) : product.stock;
    product.category = category || product.category;
    product.shopName = shopName || product.shopName;
    product.deliveryType = deliveryType || product.deliveryType;
    product.deliveryFee = deliveryFee !== undefined ? parseFloat(deliveryFee) : product.deliveryFee;
    product.estimatedDeliveryTime = estimatedDeliveryTime || product.estimatedDeliveryTime;
    product.weight = weight !== undefined ? parseFloat(weight) : product.weight;

    if (dimensions) {
      product.dimensions = {
        length: dimensions.length !== undefined ? parseFloat(dimensions.length) : product.dimensions?.length || 0,
        width: dimensions.width !== undefined ? parseFloat(dimensions.width) : product.dimensions?.width || 0,
        height: dimensions.height !== undefined ? parseFloat(dimensions.height) : product.dimensions?.height || 0,
      };
    }

    // ✅ Tags
    if (tags) product.tags = Array.isArray(tags) ? tags : [tags];

    // ✅ Suppression d'images
    if (removedImages && Array.isArray(removedImages)) {
      const imagesToKeep = product.images.filter(img => !removedImages.includes(img._id?.toString()) && !removedImages.includes(img.public_id));
      const imagesToDelete = product.images.filter(img => removedImages.includes(img._id?.toString()) || removedImages.includes(img.public_id));

      await Promise.all(imagesToDelete.map(img => cloudinary.uploader.destroy(img.public_id)));
      product.images = imagesToKeep;
    }

    // ✅ Ajout nouvelles images
    const newImages = req.files['newImages[]'] || [];
    if (newImages.length > 0) {
      const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, "_")}/${product.category.trim().replace(/\s+/g, "_")}`;
      const remainingSlots = 4 - product.images.length;

      if (newImages.length > remainingSlots) {
        return responseReturn(res, 400, { message: `Vous pouvez ajouter jusqu'à ${remainingSlots} images supplémentaires.` });
      }

      const uploads = await Promise.all(
        newImages.map(file =>
          cloudinary.uploader.upload(file.path, {
            folder: folderPath,
            public_id: `${product.slug}-${Date.now()}`
          }).then(result => {
            fs.promises.unlink(file.path).catch(console.error);
            return { url: result.secure_url, public_id: result.public_id };
          })
        )
      );

      product.images.push(...uploads);
    }

    if (product.images.length < 1 || product.images.length > 4) {
      return responseReturn(res, 400, { message: "Le produit doit avoir entre 1 et 4 images." });
    }

        // ✅ Variantes
        const variantImages = req.files['variantImage'] || [];
        const normalizedVariants = [];

    if (variants && Array.isArray(variants) && variants.length > 0) {
        for (let i = 0; i < variants.length; i++) {
            const variant = variants[i];
            const stockValue = parseInt(variant.variantStock);

            if (isNaN(stockValue)) {
            return responseReturn(res, 400, { message: `Le stock est obligatoire pour la variante ${i + 1}.` });
            }

            let variantPrice = parseFloat(variant.variantPrice);
            if (isNaN(variantPrice) || variantPrice <= 0) {
            variantPrice = product.price;
            }

            // Recherche si la variante existait déjà
            const existingVariant = product.variants.find(v =>
            v.color === variant.color && v.size === variant.size
            );

            let variantImageUrl = '';

            // Upload d'une nouvelle image si présente
            if (variantImages[i]) {
            const uploadResult = await cloudinary.uploader.upload(variantImages[i].path, {
                folder: `${product.slug}/variants`,
                public_id: `${product.slug}-variant-${i}-${Date.now()}`
            });
            variantImageUrl = uploadResult.secure_url;
            await fs.promises.unlink(variantImages[i].path).catch(console.error);
            } else if (existingVariant) {
            // On conserve l'image existante
            variantImageUrl = existingVariant.variantImage;
            }

            normalizedVariants.push({
            color: variant.color,
            size: variant.size,
            variantPrice,
            variantStock: stockValue,
            variantImage: variantImageUrl
            });
        }
        // Remplace les variantes par la liste normalisée
        product.variants = normalizedVariants;
        }


    await product.save();

    return responseReturn(res, 200, {
      message: "Produit mis à jour avec succès.",
      product
    });

  } catch (error) {
    console.error("❌ Erreur update product :", error);
    return responseReturn(res, 500, { message: "Erreur interne.", error: error.message });
  }
};
*/


export const updateProduct = async (req, res) => {
  try {
    const parsedBody = qs.parse(req.body);
    const {
      productId,
      name,
      description,
      discount,
      price,
      brand,
      stock,
      category,
      shopName,
      productCondition,
      tags,
      deliveryType,
      deliveryFee,
      estimatedDeliveryTime,
      weight,
      dimensions,
      variants,
      removedImages
    } = parsedBody;

    if (!productId) return responseReturn(res, 400, { message: "ID du produit requis." });

    const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId)
    const product = await productModel.findById(productObjectId );
    if (!product) return responseReturn(res, 404, { message: "Produit introuvable." });

   // console.log('discount ', discount)
   // console.log('product discount ', product.discount)
     let newdiscount=0
    if (discount !== undefined && !isNaN(parseFloat(discount))) {
       newdiscount = parseFloat(discount);
    }

    //  Champs principaux
    product.name = name?.trim() || product.name;
    product.slug = name ? name.trim().split(" ").join("-").toLowerCase() : product.slug;
    product.description = description || product.description;
    product.discount = parseFloat(newdiscount) || parseFloat(product.discount);////
    product.price = price !== undefined ? parseFloat(price) : product.price;
    product.brand = brand || product.brand;
    product.stock = stock !== undefined ? parseInt(stock) : product.stock;
    product.category = category || product.category;
    product.shopName = shopName || product.shopName;
    product.productCondition = productCondition || product.productCondition;
    product.deliveryType = deliveryType || product.deliveryType;
    product.deliveryFee = deliveryFee !== undefined ? parseFloat(deliveryFee) : product.deliveryFee;
    product.estimatedDeliveryTime = estimatedDeliveryTime || product.estimatedDeliveryTime;
    product.weight = weight !== undefined ? parseFloat(weight) : product.weight;

    if (dimensions) {
      product.dimensions = {
        length: parseFloat(dimensions.length) || 0,
        width: parseFloat(dimensions.width) || 0,
        height: parseFloat(dimensions.height) || 0,
      };
    }

    //  Tags
    product.tags = tags ? (Array.isArray(tags) ? tags : [tags]) : product.tags;

    //  Suppression d'images
    if (removedImages && Array.isArray(removedImages)) {
      const toDelete = product.images.filter(img =>
        removedImages.includes(img._id?.toString()) || removedImages.includes(img.public_id)
      );
      const toKeep = product.images.filter(img =>
        !removedImages.includes(img._id?.toString()) && !removedImages.includes(img.public_id)
      );

      await Promise.all(toDelete.map(img => cloudinary.uploader.destroy(img.public_id)));
      product.images = toKeep;
    }

    //  Ajout images principales
    const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, "_")}/${product.category.trim().replace(/\s+/g, "_")}`;
    const newImages = req.files['newImages[]'] || [];
    if (newImages.length > 0) {
      const remainingSlots = 4 - product.images.length;

      if (newImages.length > remainingSlots) {
        return responseReturn(res, 400, {
          message: `Vous pouvez ajouter jusqu'à ${remainingSlots} images supplémentaires.`
        });
      }

      const uploads = await Promise.all(
        newImages.map(file =>
          cloudinary.uploader.upload(file.path, {
            folder: folderPath,
            public_id: `${product.slug}-${Date.now()}`
          }).then(result => {
            fs.promises.unlink(file.path).catch(console.error);
            return { url: result.secure_url, public_id: result.public_id };
          })
        )
      );

      product.images.push(...uploads);
    }

    //  Traitement des variantes
    const variantImages = req.files['variantImage'] || [];
    const normalizedVariants = [];

    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        const stockValue = parseInt(variant.variantStock);
        const variantPrice = parseFloat(variant.variantPrice) || product.price;

        if (isNaN(stockValue)) {
          return responseReturn(res, 400, { message: `Stock invalide pour une variante.` });
        }

        //  Convertir ou générer un _id valide
        let variantId;
        if (mongoose.Types.ObjectId.isValid(variant._id)) {
          variantId = mongoose.Types.ObjectId.createFromHexString(variant._id);
        } else {
          variantId = new mongoose.Types.ObjectId();
        }

        const existingVariant = product.variants.find(v => v._id?.toString() === variantId.toString());
        let imageData = existingVariant?.variantImage || undefined;

        //console.log('variant id ', variantId);
        //console.log('existing variant ', existingVariant);
        //console.log('image Data ', imageData);

        const matchedImage = variantImages.find(file =>
          file.originalname?.includes(variantId.toString())
        );

       // console.log('variant id ', variantId);
       // console.log('existing variant ', existingVariant);
        //console.log('image Data ', imageData);

        if (matchedImage) {
          const uploadResult = await cloudinary.uploader.upload(matchedImage.path, {
            folder: `${folderPath}/variants`,
            public_id: `${product.slug}-variant-${variantId}-${Date.now()}`
          });



          await fs.promises.unlink(matchedImage.path).catch(console.error);

          if (imageData?.public_id) {
            await cloudinary.uploader.destroy(imageData.public_id);
          }

          imageData = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            _id: new mongoose.Types.ObjectId(),
          };
        }

        normalizedVariants.push({
          _id: variantId,
          color: variant.color,
          size: variant.size,
          variantPrice,
          variantStock: stockValue,
          variantImage: imageData
        });
      }

      product.variants = normalizedVariants;
    }

    await product.save();

    return responseReturn(res, 200, {
      message: "Produit mis à jour avec succès.",
      product
    });

  } catch (error) {
    console.error("❌ Erreur update product :", error);
    return responseReturn(res, 500, {
      message: "Erreur interne.",
      error: error.message
    });
  }
};



export const delete_product = async (req, res) => {
    const { id } = req.params; // ID du produit à supprimer
    //console.log("prdouit à supprimer", id);
    //console.log("produit : " , product);
    try {
        // Récupérer le produit par ID
        const product = await productModel.findById(id);

        if (!product) {
            return responseReturn(res, 404, { message: 'Produit introuvable.' });
        }

        // Vérification de l'utilisateur (si nécessaire)
        if (req.user.id !== product.sellerId.toString()) {
            return responseReturn(res, 403, { message: 'Non autorisé à supprimer ce produit.' });
        }

        // Suppression des images dans Cloudinary
        const deletePromises = product.images.map((img) =>
            cloudinary.uploader.destroy(img.public_id)
        );
        await Promise.all(deletePromises);

        // Suppression du produit dans la base de données
        await productModel.findByIdAndDelete(id);

        responseReturn(res, 200, { message: 'Produit et ses images supprimés avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit :', error.message);
        responseReturn(res, 500, { message: 'Erreur lors de la suppression du produit.' });
    }
};


export const get_category_tags = async (req, res) =>{
    const { category } = req.query;
    //console.log('category', category)

  if (!category) {
     return responseReturn(res, 400, { message: 'category is required.' });
    //return res.status(400).json({ error: 'Category is required' });
  }

  try {
    const result = await productModel.aggregate([
      { $match: { category } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }, // tu peux ajuster selon les besoins
    ]);

    const tags = result.map(tag => tag._id);
   // console.log('tags', tags)
   // res.json({ tags });
    return responseReturn(res, 200, { tags});
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}



/*   //ancien product model funtion add product
export const add_product = async (req, res) => {
    
    try {
        // Vérification de l'authentification
        if (!req.user || !req.user.id) {
            return responseReturn(res, 401, { message: "Utilisateur non authentifié." });
        }

        const { name, description, discount, price, brand, stock, category, shopName, tags,variants } = req.body;
        const trimmedName = name.trim();
        const slug = trimmedName.split(" ").join("-");

        // Vérification des fichiers téléchargés
        if (!req.files || req.files.length === 0) {
            return responseReturn(res, 400, { message: "Au moins une image est requise." });
        }

        // Vérification du nombre d'images (entre 1 et 4)
        if (req.files.length < 1 || req.files.length > 4) {
            return responseReturn(res, 400, { message: "Le nombre d'images doit être compris entre 1 et 4." });
        }

        const folderPath = `GOBYMALL/${shopName.trim().replace(/\s+/g, '_')}/${category.trim().replace(/\s+/g, '_')}`;
        let images = [];
        const uploadPromises = req.files.map(file =>
            cloudinary.uploader.upload(file.path, {
                folder: folderPath,
                public_id: `${slug}-${Date.now()}`
            }).then(result => {
                // Suppression des fichiers temporaires
                fs.promises.unlink(file.path).catch(err => console.error("Erreur suppression fichier :", err));
                return { url: result.secure_url, public_id: result.public_id };
            })
        );

        try {
            const uploadResults = await Promise.allSettled(uploadPromises);
            images = uploadResults.filter(r => r.status === "fulfilled").map(r => r.value);

            if (images.length !== req.files.length) {
                return responseReturn(res, 400, { message: "Certains fichiers n'ont pas été téléchargés." });
            }
        } catch (error) {
            return responseReturn(res, 500, { message: "Erreur lors de l'upload des fichiers." });
        }

           // Normalisation des tags et variants
           const normalizedTags = Array.isArray(tags)
           ? tags
           : tags ? [tags] : [];

       const normalizedVariants = Array.isArray(variants)
           ? variants
           : variants ? [variants] : [];

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
            images,
            tags: normalizedTags,
            variants: normalizedVariants
        });

        return responseReturn(res, 200, { 
            message: "Produit ajouté avec succès.", 
            product
        });
    } catch (error) {
        console.error(error);
        return responseReturn(res, 500, { message: "Erreur lors de l'ajout du produit." });
    }
};*/

/*
export const add_product = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            responseReturn(res, 401, { message: 'User not authenticated'});
            //return res.status(401).json({ message: 'User not authenticated' });
        }

        const { name, description, discount, price, brand, stock, category, shopName } = req.body;

        const trimmedName = name.trim();
        const slug = trimmedName.split(' ').join('-');

        if (!req.files || req.files.length === 0) {
            responseReturn(res, 500, { message: "Aucune image téléchargée"});
           // return res.status(400).json({ message: "Aucune image téléchargée" });
        }

        const folderPath = `GOBYMALL/${shopName.trim().replace(/\s+/g, '_')}/${category.trim().replace(/\s+/g, '_')}`;
       // console.log("Chemin du dossier Cloudinary :", folderPath);

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
            //console.error("Erreur lors du téléchargement :", error);
            responseReturn(res, 500, { message: "Erreur lors de l'upload des fichiers."});
           // return res.status(500).json({ message: "Erreur lors de l'upload des fichiers." });
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
        responseReturn(res, 200, { message: "Produit ajouté avec succès",});
    } catch (error) {
        
        responseReturn(res, 500, { message: "Erreur lors de l'ajout du produit" });
    }
};
*/
/*
export const add_product = async (req, res) => {
    try {
        // ✅ Parse propre du body imbriqué (grâce à qs)
        const parsedBody = qs.parse(req.body);

        // ✅ Vérification utilisateur connecté
        if (!req.user || !req.user.id) {
            return responseReturn(res, 401, { message: "Utilisateur non authentifié." });
        }

        const {
            name,
            description,
            discount,
            price,
            brand,
            stock,
            category,
            shopName,
            tags,
            deliveryType,
            deliveryFee,
            estimatedDeliveryTime,
            weight,
            dimensions,
            variants
        } = parsedBody;

        const trimmedName = name.trim();
        const slug = trimmedName.split(" ").join("-").toLowerCase();

        // ✅ Traitement des images produit
        const productImages = req.files['images[]'] || [];
        if (productImages.length === 0) {
            return responseReturn(res, 400, { message: "Au moins une image produit est requise." });
        }
        if (productImages.length > 4) {
            return responseReturn(res, 400, { message: "Maximum 4 images produit autorisées." });
        }

        const folderPath = `GOBYMALL/${shopName.trim().replace(/\s+/g, '_')}/${category.trim().replace(/\s+/g, '_')}`;
        let images = [];

        const uploadProductImages = productImages.map(file =>
            cloudinary.uploader.upload(file.path, {
                folder: folderPath,
                public_id: `${slug}-${Date.now()}`
            }).then(result => {
                fs.promises.unlink(file.path).catch(console.error);
                return { url: result.secure_url, public_id: result.public_id };
            })
        );

        const productUploadResults = await Promise.allSettled(uploadProductImages);
        images = productUploadResults.filter(r => r.status === "fulfilled").map(r => r.value);

        if (images.length !== productImages.length) {
            return responseReturn(res, 400, { message: "Erreur lors de l'upload des images produit." });
        }

        // ✅ Normalisation des tags
        const normalizedTags = Array.isArray(tags) ? tags : tags ? [tags] : [];

        // ✅ Traitement des variantes
        const variantImages = req.files['variantImage'] || [];
        let normalizedVariants = [];

        if (variants && Array.isArray(variants)) {
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                let variantImageUrl = "";

                // ✅ Upload image de variante si présente
                if (variantImages[i]) {
                    const uploadResult = await cloudinary.uploader.upload(variantImages[i].path, {
                        folder: `${folderPath}/variants`,
                        public_id: `${slug}-variant-${i}-${Date.now()}`
                    });
                    variantImageUrl = uploadResult.secure_url;
                    await fs.promises.unlink(variantImages[i].path).catch(console.error);
                }

                normalizedVariants.push({
                    color: variant.color,
                    size: variant.size,
                    variantPrice: parseFloat(variant.variantPrice) || 0,
                    variantStock: parseInt(variant.variantStock) || 0,
                    variantImage: variantImageUrl
                });
            }
        }

        // ✅ Création du produit en base
        const product = await productModel.create({
            sellerId: req.user.id,
            name: trimmedName,
            slug,
            description: description.trim(),
            discount: parseFloat(discount) || 0,
            price: parseFloat(price),
            brand: brand.trim(),
            stock: parseInt(stock),
            category: category.trim(),
            shopName: shopName.trim(),
            images,
            tags: normalizedTags,
            variants: normalizedVariants,
            deliveryType,
            deliveryFee: parseFloat(deliveryFee) || 0,
            estimatedDeliveryTime: estimatedDeliveryTime.trim(),
            weight: parseFloat(weight) || undefined,
            dimensions: dimensions ? {
                length: parseFloat(dimensions.length) || 0,
                width: parseFloat(dimensions.width) || 0,
                height: parseFloat(dimensions.height) || 0
            } : undefined
        });

        console.log('✅ Produit créé avec succès :', product);

        return responseReturn(res, 200, {
            message: "Produit ajouté avec succès.",
            product
        });

    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du produit :", error);
        return responseReturn(res, 500, { message: "Erreur interne lors de l'ajout du produit." });
    }
};
*/


/*
export const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, discount, price, brand, stock, category, removedImages, tags, variants } = req.body;

        if (!productId) {
            return responseReturn(res, 400, { message: "ID du produit requis" });
        }

        // Vérifiez que le produit existe
        const product = await productModel.findById(productId);
        if (!product) {
            return responseReturn(res, 404, { message: "Produit introuvable" });
        }

        // Mise à jour des propriétés du produit
        product.name = name?.trim() || product.name;
        product.slug = name?.trim().split(' ').join('-') || product.slug;
        product.description = description || product.description;
        product.price = parseFloat(price) || product.price;
        product.discount = parseInt(discount) || product.discount;
        product.brand = brand || product.brand;
        product.stock = parseInt(stock) || product.stock;
        product.category = category || product.category;

        // mise à jiur des tags set des variants

                   // Normalisation des tags et variants
           const normalizedTags = Array.isArray(tags)
           ? tags
           : tags ? [tags] : [];

       const normalizedVariants = Array.isArray(variants)
           ? variants
           : variants ? [variants] : [];

        product.tags = normalizedTags || product.tags;
        product.variants = normalizedVariants || product.variants;

        // Gestion des suppressions d'images
        if (removedImages && Array.isArray(removedImages)) {
            const isIdBased = product.images.some(img => removedImages.includes(img._id.toString()));

            const imagesToDelete = isIdBased
                ? product.images.filter(img => removedImages.includes(img._id.toString()))
                : product.images.filter(img => removedImages.includes(img.public_id));

            const deletePromises = imagesToDelete.map(img => cloudinary.uploader.destroy(img.public_id));
            await Promise.all(deletePromises);

            const imagesToKeep = isIdBased
                ? product.images.filter(img => !removedImages.includes(img._id.toString()))
                : product.images.filter(img => !removedImages.includes(img.public_id));

            product.images = imagesToKeep;
        }

        // Gestion des nouvelles images si fournies
        if (req.files && req.files.length > 0) {
            const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, "_")}/${product.category.trim().replace(/\s+/g, "_")}`;
            const remainingSlots = 4 - product.images.length;

            if (req.files.length > remainingSlots) {
                return responseReturn(res, 400, { message: `Vous pouvez ajouter jusqu'à ${remainingSlots} images supplémentaires` });
            }

            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, {
                    folder: folderPath,
                    public_id: `${product.slug}-${Date.now()}`,
                }).then(result => {
                    fs.promises.unlink(file.path); // Suppression des fichiers temporaires
                    return { url: result.secure_url, public_id: result.public_id };
                })
            );

            const uploadedImages = await Promise.all(uploadPromises);
            product.images = [...product.images, ...uploadedImages];
        }

        // Validation finale pour vérifier le nombre d'images
        if (product.images.length < 1 || product.images.length > 4) {
            return responseReturn(res, 400, { message: "Le produit doit avoir entre 1 et 4 images" });
        }

        // Sauvegarde du produit mis à jour
        await product.save();

        return responseReturn(res, 200, { message: "Le produit a été mis à jour avec succès" });

    } catch (error) {
        console.error("Erreur lors de la mise à jour du produit :", error);
        return responseReturn(res, 500, { message: "Une erreur est survenue", error: error.message });
    }
};
*/


/*
export const updateProduct = async (req, res) => {
    try {
        // ✅ Parse body imbriqué
        const parsedBody = qs.parse(req.body);

        const {
            productId,
            name,
            description,
            discount,
            price,
            brand,
            stock,
            category,
            shopName,
            tags,
            deliveryType,
            deliveryFee,
            estimatedDeliveryTime,
            weight,
            dimensions,
            variants,
            removedImages
        } = parsedBody;

        if (!productId) {
            return responseReturn(res, 400, { message: "ID du produit requis." });
        }

        // ✅ Chercher le produit existant
        const product = await productModel.findById(productId);
        if (!product) {
            return responseReturn(res, 404, { message: "Produit introuvable." });
        }

        // ✅ Mise à jour des champs texte / numériques
        product.name = name?.trim() || product.name;
        product.slug = name ? name.trim().split(' ').join('-').toLowerCase() : product.slug;
        product.description = description || product.description;
        product.discount = discount !== undefined ? parseFloat(discount) : product.discount;
        product.price = price !== undefined ? parseFloat(price) : product.price;
        product.brand = brand || product.brand;
        product.stock = stock !== undefined ? parseInt(stock) : product.stock;
        product.category = category || product.category;
        product.shopName = shopName || product.shopName;
        product.deliveryType = deliveryType || product.deliveryType;
        product.deliveryFee = deliveryFee !== undefined ? parseFloat(deliveryFee) : product.deliveryFee;
        product.estimatedDeliveryTime = estimatedDeliveryTime || product.estimatedDeliveryTime;
        product.weight = weight !== undefined ? parseFloat(weight) : product.weight;

        // ✅ Dimensions (si fourni)
        if (dimensions) {
            product.dimensions = {
                length: dimensions.length !== undefined ? parseFloat(dimensions.length) : product.dimensions?.length || 0,
                width: dimensions.width !== undefined ? parseFloat(dimensions.width) : product.dimensions?.width || 0,
                height: dimensions.height !== undefined ? parseFloat(dimensions.height) : product.dimensions?.height || 0
            };
        }

        // ✅ Tags
        const normalizedTags = Array.isArray(tags) ? tags : tags ? [tags] : product.tags;
        product.tags = normalizedTags;

        // ✅ Suppression d'anciennes images produit
        if (removedImages && Array.isArray(removedImages)) {
            const isIdBased = product.images.some(img => removedImages.includes(img._id?.toString()));

            const imagesToDelete = isIdBased
                ? product.images.filter(img => removedImages.includes(img._id.toString()))
                : product.images.filter(img => removedImages.includes(img.public_id));

            const deletePromises = imagesToDelete.map(img => cloudinary.uploader.destroy(img.public_id));
            await Promise.all(deletePromises);

            const imagesToKeep = isIdBased
                ? product.images.filter(img => !removedImages.includes(img._id.toString()))
                : product.images.filter(img => !removedImages.includes(img.public_id));

            product.images = imagesToKeep;
        }

        // ✅ Upload nouvelles images produit
        const newImages = req.files['newImages[]'] || [];
        if (newImages.length > 0) {
            const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, "_")}/${product.category.trim().replace(/\s+/g, "_")}`;
            const remainingSlots = 4 - product.images.length;

            if (newImages.length > remainingSlots) {
                return responseReturn(res, 400, { message: `Vous pouvez ajouter jusqu'à ${remainingSlots} images supplémentaires.` });
            }

            const uploadPromises = newImages.map(file =>
                cloudinary.uploader.upload(file.path, {
                    folder: folderPath,
                    public_id: `${product.slug}-${Date.now()}`
                }).then(result => {
                    fs.promises.unlink(file.path).catch(console.error);
                    return { url: result.secure_url, public_id: result.public_id };
                })
            );

            const uploadedImages = await Promise.all(uploadPromises);
            product.images = [...product.images, ...uploadedImages];
        }

        // ✅ Validation du nombre total d'images produit
        if (product.images.length < 1 || product.images.length > 4) {
            return responseReturn(res, 400, { message: "Le produit doit avoir entre 1 et 4 images." });
        }

        // ✅ Gestion des variantes
        const variantImages = req.files['variantImage'] || [];
        let normalizedVariants = [];

        if (variants && Array.isArray(variants)) {
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                let variantImageUrl = "";

                // ✅ Upload image variante si présente
                if (variantImages[i]) {
                    const uploadResult = await cloudinary.uploader.upload(variantImages[i].path, {
                        folder: `${product.slug}/variants`,
                        public_id: `${product.slug}-variant-${i}-${Date.now()}`
                    });
                    variantImageUrl = uploadResult.secure_url;
                    await fs.promises.unlink(variantImages[i].path).catch(console.error);
                } else if (product.variants[i]) {
                    // Si pas de nouvelle image → garder l'ancienne
                    variantImageUrl = product.variants[i].variantImage;
                }

                normalizedVariants.push({
                    color: variant.color,
                    size: variant.size,
                    variantPrice: parseFloat(variant.variantPrice) || 0,
                    variantStock: parseInt(variant.variantStock) || 0,
                    variantImage: variantImageUrl
                });
            }
        } else {
            // ✅ Si aucune variante envoyée → garder les anciennes
            normalizedVariants = product.variants;
        }

        product.variants = normalizedVariants;

        // ✅ Sauvegarde finale
        await product.save();

        return responseReturn(res, 200, {
            message: "Le produit a été mis à jour avec succès.",
            product
        });

    } catch (error) {
        console.error("❌ Erreur update product :", error);
        return responseReturn(res, 500, { message: "Erreur interne lors de la mise à jour du produit.", error: error.message });
    }
};
*/
