import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import productModel from '../../models/productModel.js';
import { responseReturn } from '../../utiles/response.js';

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
export const add_product = async (req, res) => {
    
    try {
        // Vérification de l'authentification
        if (!req.user || !req.user.id) {
            return responseReturn(res, 401, { message: "Utilisateur non authentifié." });
        }

        const { name, description, discount, price, brand, stock, category, shopName } = req.body;
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

        return responseReturn(res, 200, { 
            message: "Produit ajouté avec succès.", 
            product
        });
    } catch (error) {
        console.error(error);
        return responseReturn(res, 500, { message: "Erreur lors de l'ajout du produit." });
    }
};

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
        const { productId, name, description, discount, price, brand, stock, category, removedImages} = req.body;
      
      // console.log("removedImages", removedImages);

        if (!productId) {
           // return responseReturn(res, 400, false, "ID du produit requis");
            responseReturn(res, 400, {message :"ID du produit requis"});
        }

        // Vérifiez que le produit existe
        const product = await productModel.findById(productId);
        if (!product) {
            responseReturn(res, 404,{message :"Produit introuvable"});
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

        
        // Gestion des suppressions d'images
        if (removedImages && Array.isArray(removedImages)) {
            // Vérifiez si removedImages contient des `_id` ou des `public_id`
            const isIdBased = product.images.some(img => removedImages.includes(img._id.toString()));

            if (isIdBased) {
                // Suppression basée sur les `_id`
                const imagesToKeep = product.images.filter((img) => !removedImages.includes(img._id.toString()));
                
                // Supprimer les images sur Cloudinary basées sur `public_id`
                const deletePromises = product.images
                    .filter((img) => removedImages.includes(img._id.toString()))
                    .map((img) => cloudinary.uploader.destroy(img.public_id));
                
                await Promise.all(deletePromises);
                product.images = imagesToKeep;
            } else {
                // Suppression basée sur `public_id`
                const imagesToKeep = product.images.filter((img) => !removedImages.includes(img.public_id));
                
                // Supprimer les images sur Cloudinary
                const deletePromises = product.images
                    .filter((img) => removedImages.includes(img.public_id))
                    .map((img) => cloudinary.uploader.destroy(img.public_id));
                
                await Promise.all(deletePromises);
                product.images = imagesToKeep;
            }
        }

        // Gestion des nouvelles images si fournies
        if (req.files && req.files.length > 0) {
            const folderPath = `GOBYMALL/${product.shopName.trim().replace(/\s+/g, "_")}/${product.category.trim().replace(/\s+/g, "_")}`;
            const remainingSlots = 4 - product.images.length;

            if (req.files.length > remainingSlots) {
                 responseReturn(res, 400, {message:`Vous pouvez ajouter jusqu'à ${remainingSlots} images supplémentaires`});
            }

            // Upload des nouvelles images vers Cloudinary
            const uploadPromises = req.files.map((file) =>
                cloudinary.uploader.upload(file.path, {
                    folder: folderPath,
                    public_id: `${product.slug}-${Date.now()}`,
                }).then((result) => {
                    fs.promises.unlink(file.path); // Suppression des fichiers temporaires
                    return { url: result.secure_url, public_id: result.public_id };
                })
            );

            const uploadedImages = await Promise.all(uploadPromises);
            product.images = [...product.images, ...uploadedImages];
        }

        // Validation finale pour vérifier qu'il y a au moins une image
        if (product.images.length === 0) {
          return responseReturn(res, 400, {message:"Le produit doit avoir au moins une image"});
        }

       // console.log("produit mis à jour avec succès", product);
        // Sauvegarde du produit mis à jour
        await product.save();
        
      return  responseReturn(res, 200, {message:"Le produit a été mis à jour avec succès"});

    } catch (error) {
        console.error("Erreur lors de la mise à jour du produit :", error);
        return responseReturn(res, 500, false, "Une erreur est survenue", error.message);
    }
};
*/
export const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, discount, price, brand, stock, category, removedImages } = req.body;

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

