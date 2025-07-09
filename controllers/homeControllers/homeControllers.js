import moment from "moment";
import mongoose from "mongoose";
import categoryModel from "../../models/categoryModel.js";
import productModel from "../../models/productModel.js";
import reviewModel from "../../models/reviewsModel.js";
import sellerModel from "../../models/sellerModel.js";
import { calculateDynamicShipping, getClientLocationFromIP } from "../../utiles/dynamicDeliveryFees.js";
import { responseReturn } from "../../utiles/response.js";

// Format products into rows of 3
const formatProduct = (products) => {
    const productArray = [];
    let i = 0;

    while (i < products.length) {
        const temp = [];
        let j = i;
        while (j < i + 3 && j < products.length) { // Ensure index does not exceed array length
            temp.push(products[j]);
            j++;
        }
        productArray.push(temp);
        i = j;
    }
    return productArray;
};

export const get_home_Category = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
            // ✅ Obtenir localisation client via IP
        const clientLocation = await getClientLocationFromIP();
        //console.log("Localisation client détectée :", clientLocation);
        responseReturn(res, 200, { categories, clientLocation});
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories" });
    }
};

export const get_home_product = async (req, res) => {
    try {
        // Get products sorted by creation date
        const products = await productModel.find({}).limit(16).sort({ createdAt: -1 });

        // Get the latest 9 products and format them
        const allProducts = await productModel.find({}).limit(9).sort({ createdAt: -1 });
        const latestProducts = formatProduct(allProducts);

        // Get top-rated products with a rating >= 9
        //const ratedProducts = await productModel.find({ rating: { $gte: 9 } }).limit(9).sort({ rating: -1 });
        const ratedProducts = await productModel.find({ rating: { $gte: 1 } }).limit(9).sort({ rating: -1 });
        const topRatedProducts = formatProduct(ratedProducts);

        // Get top discounted products
        //const discountProducts = await productModel.find({ discount: { $exists: true, $gt: 0 } }).limit(9).sort({ discount: -1 });
        const discountProducts = await productModel.find({}).limit(9).sort({ discount: -1 });
        const topDiscountedProducts = formatProduct(discountProducts);

        // Debug output
       // process.stdout.write("Home discountProducts: " + JSON.stringify(topDiscountedProducts) + "\n");

        // Return response
        responseReturn(res, 200, { products, latestProducts, topRatedProducts, topDiscountedProducts});
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
};

export const get_price_range_latest_products = async (req, res) => {
    try {
        const priceRange = {
            min: 0,
            max: 0,
        };

        // Get the latest 9 products and format them
        const products = await productModel.find({}).limit(9).sort({ createdAt: -1 });
        const priceRangeLatestProducts = formatProduct(products);

        const priceRangeLatest = await productModel.find({}).sort({ price: 1 });

        if (priceRangeLatest.length > 0) {
            priceRange.max = priceRangeLatest[priceRangeLatest.length - 1].price;
            priceRange.min = priceRangeLatest[0].price;
        }

        //console.log("latest products:", priceRange);

        // Return response
        responseReturn(res, 200, { priceRangeLatestProducts, priceRange });
    } catch (error) {
        console.error("Server error:", error);
        responseReturn(res, 500, { message: "Error fetching products" });
    }
};


export const get_query_sort_products = async (req, res) => {
    const parPage = 25;
    req.query.parPage = parPage;
    //console.log('query req ', req.query);

    try {
        // Préparez les filtres avec validation
        const filters = {
            ...(req.query.categorie && { category: req.query.categorie }),
            ...(req.query.rating && !isNaN(Number(req.query.rating)) && {
                rating: { $gte: Number(req.query.rating.trim()) },
            }),
            ...(req.query.lowPrice && !isNaN(Number(req.query.lowPrice)) &&
            req.query.highPrice && !isNaN(Number(req.query.highPrice)) && {
                price: { $gte: Number(req.query.lowPrice), $lte: Number(req.query.highPrice) },
            }),
        };

        // Appliquez les filtres
        let products = await productModel.find(filters);

            if (req.query.searchValue) {
                const searchValue = req.query.searchValue.toUpperCase();
                products = products.filter(product => 
                    product.name.toUpperCase().includes(searchValue) ||
                    (product.description && product.description.toUpperCase().includes(searchValue)) ||
                    (product.category && product.category.toUpperCase().includes(searchValue)) ||
                    (product.tags && product.tags.some(tag => tag.toUpperCase().includes(searchValue)))
                );
            }
            

        // Appliquez le tri basé sur sortPrice
        if (req.query.sortPrice) {
            if (req.query.sortPrice === 'low-to-high') {
                products = products.sort((a, b) => a.price - b.price);
            } else if (req.query.sortPrice === 'high-to-low') {
                products = products.sort((a, b) => b.price - a.price);
            }
        } else {
            // Par défaut, triez par date de création décroissante
            products = products.sort((a, b) => b.createdAt - a.createdAt);
        }

        // Appliquez la pagination
        const totalProducts = products.length;
        const pageNumber = Number(req.query.pageNumber) || 1;
        const startIndex = (pageNumber - 1) * parPage;
        const paginatedProducts = products.slice(startIndex, startIndex + parPage);

        // Retournez les produits paginés et le total des produits
        responseReturn(res, 200, { products: paginatedProducts, totalProducts, parPage });
    } catch (error) {
        //console.error("Error fetching products:", error);
        responseReturn(res, 500, { message: "Erreur lors de la récupération des produits" });
    }
};

export const get_product = async (req, res) => {
    const { productId } = req.params;
   // console.log("productId contenu brut:", productId);
    
    try {
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            // console.log("ID utilisateur invalide :", id);
            return responseReturn(res, 400, { message: "ID invalide" });
        }
    const productIdObjectId = mongoose.Types.ObjectId.createFromHexString(productId);
    const product = await productModel.findById(productIdObjectId);
    if (!product) {
        return responseReturn(res, 404, { message: "Produit non trouvé" });
    }

        const relatedProducts = await productModel.find({
            $and: [{
                    _id: {
                        $ne: product.id
                    }
                },
                {
                    category: {
                        $eq: product.category
                    }
                }
            ]
        }).limit(20)

      //  console.log('related Products', relatedProducts)

        const moreProducts = await productModel.find({

            $and: [{
                    _id: {
                        $ne: product.id
                    }
                },
                {
                    sellerId: {
                        $eq: product.sellerId
                    }
                }
            ]
        }).limit(3)

       // console.log( 'more products', moreProducts)

       const clientLocation = await getClientLocationFromIP();
       console.log("Localisation client détectée :", clientLocation);

        /// seller info 

           const seller = await sellerModel.findById(product.sellerId);
           const sellerLocation = seller.shopInfo

           //console.log('seller ', seller)
            // console.log('seller location ', sellerLocation)

            const deliveryType = product.deliveryType; // free, fixed, negotiable, dynamic
            const deliveryFee = product.deliveryFee ?? 0;

            // ✅ Calcul des frais selon deliveryType
             let shippingFee = 0;
             const quantity = 1
       
             if (deliveryType === "free") {
               shippingFee = 0;
             } else if (deliveryType === "fixed") {
               shippingFee = deliveryFee*quantity; // ✅ Multiplier par quantité
             } else if (deliveryType === "negotiable") {
               shippingFee = "negotiable";
             } else if (deliveryType === "dynamic" && clientLocation) {
               shippingFee = await calculateDynamicShipping(
                 sellerLocation,
                 clientLocation,
                 product,
                 quantity
               );
               console.log('shipping fees', shippingFee)
             }

    //console.log("product:", product);
    responseReturn(res, 200,{ message: "Produit non trouvé" , product, moreProducts, relatedProducts, shippingFee});
    
} catch (error) {
    console.error("Error fetching product:", error);
    responseReturn(res, 500, { message: "Erreur lors de la récupération du produit " });
    
}

}

export const customer_review = async (req, res) => {
    //console.log('query infos ', req.body)
    const {name, review, rating, productId} = req.body;
    try {
     const newReview = new reviewModel({
            productId,
            name,
            rating : parseInt(rating),
            review,
            date : moment(Date.now()).format('LL')
        })
        await newReview.save();

        let totalRating = 0;

          if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
                        return responseReturn(res, 400, { message: "ID invalide" });
                }
                 // Conversion de l'ID en ObjectId
        const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId);
        const reviews = await reviewModel.find({productId});

        for (let i = 0; i < reviews.length; i++) {
            //console.log(reviews[i].rating)
            totalRating += reviews[i].rating
        }

        let averageRating = 0;
        if (reviews.length > 0) {
            averageRating = (totalRating / reviews.length).toFixed(1);
        }

        await productModel.findByIdAndUpdate(productObjectId, {
            rating : parseFloat(averageRating),
        })

        return responseReturn(res, 200, { message: "Avis ajouté avec succès"});
        
    } catch (error) {
        console.error("Error adding review:", error);
        responseReturn(res, 500, { message: "Erreur lors de l'ajout d 'un avis" });
    }
}
/*
export const getProductReviews = async (req, res) => {
    const productId = req.params.productId;
    //const slug = req.params.slug;
    const pageNumber = req.query.pageNumber ; // Par défaut, la première page
   // console.log('page slug ', slug)
    //const limit = 5;
    const parPage = 5;
    const skip = (parseInt(pageNumber) - 1) * parPage;

    try {
        // Valider l'ID produit
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return responseReturn(res, 400, { message: "ID produit invalide" });
        }

        // Récupération des avis et calcul des statistiques
        const getRating = await reviewModel.aggregate([
            {
                $match: {
                    productId:  mongoose.Types.ObjectId.createFromHexString(productId),
                }
            },
            {
                $group: {
                    _id: "$rating", // Regrouper par valeur de "rating"
                    count: { $sum: 1 } // Compter le nombre d'avis pour chaque note
                }
            },
            
        ]);

        const rating_review = [
            { rating: 5, sum: 0 },
            { rating: 4, sum: 0 },
            { rating: 3, sum: 0 },
            { rating: 2, sum: 0 },
            { rating: 1, sum: 0 },
        ]

        for (let i = 0; i < rating_review.length; i++) {
             for (let j = 0; j <getRating.length; j++) {
                if (rating_review[i].rating===getRating[j]._id) {
                    rating_review[i].sum = getRating[j].count;
                    break
                }
             }
        }

       //console.log('console getRating', getRating);

       //console.log('console Rating reviiew', rating_review);

        const getAll_Product_Reviews = await reviewModel.find({ productId: mongoose.Types.ObjectId.createFromHexString(productId) } )
        .sort({ createdAt: -1 });
        let totalReviews = 0;
        let reviews =[];
        if (getAll_Product_Reviews.length > 0) {
            totalReviews = getAll_Product_Reviews.length;
            reviews = getAll_Product_Reviews.slice(skip, skip + parPage);
            return responseReturn(res, 200, { message: "Liste des avis", rating_review, totalReviews, reviews, parPage });
        }else{
            return responseReturn(res, 404, { message: "Aucun avis trouvé" });
        }
        
       // console.log('pageNumber ', pageNumber);
       // console.log(' reviews', reviews);

        // Retourner les résultats
       
    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        return responseReturn(res, 500, { message: "Erreur serveur", error });
    }
};
*/
/*
export const getProductReviews = async (req, res) => {
    const {productId} = req.params;
    let {pageNumber} = req.query; // Par défaut, la première page
    const parPage = 5;
    const skip = (parseInt(pageNumber) - 1) * parPage;

    try {
        // Valider l'ID produit
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return responseReturn(res, 400, { message: "ID produit invalide" });
        }

        // Récupération des statistiques de notation
        const getRating = await reviewModel.aggregate([
            {
                $match: { productId: mongoose.Types.ObjectId.createFromHexString(productId), }
            },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Initialiser le tableau des évaluations
        const rating_review = [
            { rating: 5, sum: 0 },
            { rating: 4, sum: 0 },
            { rating: 3, sum: 0 },
            { rating: 2, sum: 0 },
            { rating: 1, sum: 0 }
        ];

        // Mettre à jour les évaluations avec les résultats de l'agrégation
        getRating.forEach(({ _id, count }) => {
            const index = rating_review.findIndex(r => r.rating === _id);
            if (index !== -1) {
                rating_review[index].sum = count;
            }
        });

        // Récupération des avis avec pagination
        const totalReviews = await reviewModel.countDocuments({ productId: mongoose.Types.ObjectId.createFromHexString(productId)});
        const reviews = await reviewModel
            .find({ productId: mongoose.Types.ObjectId.createFromHexString(productId) })
            .skip(skip)
            .limit(parPage)
            .sort({ createdAt: -1 });

        // Vérifier si des avis existent
        if (totalReviews === 0) {
            return responseReturn(res, 404, { message: "Aucun avis trouvé", rating_review, totalReviews, reviews: ["Pas d'avis"], parPage });
        }else {
            // Retourner les avis avec les statistiques
            return responseReturn(res, 200, { 
                message: "Liste des avis récupérée avec succès", 
                rating_review, 
                totalReviews, 
                reviews, 
                parPage 
            });
        }

    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        return responseReturn(res, 500, { message: "Erreur serveur", error });
    }
};

*/

export const getProductReviews = async (req, res) => {
    const { productId } = req.params;
    //console.log('productid ', productId);
    const { pageNumber} = req.query; // Page par défaut : 1
   // console.log('page number', pageNumber)
    const parPage = 5;
    const skip = (parseInt(pageNumber) - 1) * parPage;

    try {
        // Valider l'ID produit
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return responseReturn(res, 400, { message: "ID produit invalide" });
        }

        // Vérifier si des avis existent pour ce produit
        const totalReviews = await reviewModel.countDocuments({
            productId: mongoose.Types.ObjectId.createFromHexString(productId),
        });
     /*
       if (totalReviews === 0) {
            return responseReturn(res, 201, {
                message: "Aucun avis trouvé",
                rating_review: initializeRatingReview(), // Générer un tableau vide
                totalReviews: 0,
                reviews: [],
            });
        }  
    */
        // Récupération des statistiques de notation
        const getRating = await reviewModel.aggregate([
            {
                $match: {
                    productId: mongoose.Types.ObjectId.createFromHexString(productId),
                },
            },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Initialiser et mettre à jour les évaluations
        const rating_review = initializeRatingReview();
        getRating.forEach(({ _id, count }) => {
            const index = rating_review.findIndex((r) => r.rating === _id);
            if (index !== -1) {
                rating_review[index].sum = count;
            }
        });

        //console.log('rating_review ', rating_review);
        // Récupérer les avis avec pagination
        const reviews = await reviewModel
            .find({
                productId: mongoose.Types.ObjectId.createFromHexString(productId),
            })
            .skip(skip)
            .limit(parPage)
            .sort({ createdAt: -1 });

        //    console.log('rewiews ', reviews);

        // Retourner les avis avec les statistiques
        return responseReturn(res, 200, {
            message: "Liste des avis récupérée avec succès",
            rating_review,
            totalReviews,
            reviews,
            productId
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        return responseReturn(res, 500, { message: "Erreur serveur", error });
    }
};

// Fonction utilitaire pour initialiser les statistiques d'évaluation
const initializeRatingReview = () => [
    { rating: 5, sum: 0 },
    { rating: 4, sum: 0 },
    { rating: 3, sum: 0 },
    { rating: 2, sum: 0 },
    { rating: 1, sum: 0 },
];

