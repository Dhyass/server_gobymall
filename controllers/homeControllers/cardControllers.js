
import mongoose from "mongoose";
import cardModel from "../../models/cardModel.js";
import Product from "../../models/productModel.js";
import WishlistModel from "../../models/wishlistModel.js";
import { calculateDynamicShipping, geocodeAddress, getClientLocationFromIP } from "../../utiles/dynamicDeliveryFees.js";
import { responseReturn } from "../../utiles/response.js";



export const add_to_card = async (req, res) => {
  const { customerId, productId, quantity, selectedVariant } = req.body;

  try {
    // ✅ Vérification des IDs
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return responseReturn(res, 400, { message: "ID client invalide." });
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return responseReturn(res, 400, { message: "ID produit invalide." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return responseReturn(res, 404, { message: "Produit introuvable." });
    }

    // ✅ Vérifier le stock réel
    let stockAvailable = product.stock;
    let priceToUse = product.price;
    let variantImage = product.thumbnail;

    if (selectedVariant) {
      const variantInProduct = product.variants.find(v =>
        v.color === selectedVariant.color && v.size === selectedVariant.size
      );

      if (!variantInProduct) {
        return responseReturn(res, 400, { message: "Variante introuvable." });
      }

     // console.log('variant', variantInProduct);

      stockAvailable = variantInProduct.variantStock;
      priceToUse = variantInProduct.variantPrice ?? product.price;
      variantImage = variantInProduct.variantImage ?? product.thumbnail;
    }

    if (quantity > stockAvailable) {
      return responseReturn(res, 400, {
        message: `Stock insuffisant. Seulement ${stockAvailable} en stock.`
      });
    }

     const customerObjectId = mongoose.Types.ObjectId.createFromHexString(customerId);
     const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId);

    // ✅ Vérifier si le produit + variante est déjà dans le panier
    const existingCard = await cardModel.findOne({
      customerId: customerObjectId,
      productId,
      ...(selectedVariant?.color ? { 'selectedVariant.color': selectedVariant.color } : {}),
      ...(selectedVariant?.size ? { 'selectedVariant.size': selectedVariant.size } : {})
    });

    if (existingCard) {
      const totalQuantity = existingCard.quantity + quantity;

      if (totalQuantity > stockAvailable) {
        return responseReturn(res, 400, {
          message: `Stock insuffisant. Vous avez déjà ${existingCard.quantity} dans le panier, il reste ${stockAvailable - existingCard.quantity}.`
        });
      }

      existingCard.quantity = totalQuantity;
      await existingCard.save();

      return responseReturn(res, 200, {
        message: "La quantité du produit a été mise à jour dans votre panier.",
        cartItem: existingCard
      });
    }

    // ✅ Ajouter le produit au panier avec une copie du stock et prix de la variante
    const newCard = new cardModel({
      customerId: customerObjectId,
      productId,
      quantity,
      selectedVariant: selectedVariant ? {
        color: selectedVariant.color,
        size: selectedVariant.size,
        variantPrice: priceToUse,
        variantImage: variantImage,
        variantStock: stockAvailable
      } : undefined
    });

    await newCard.save();

    return responseReturn(res, 201, {
      message: "Produit ajouté au panier avec succès.",
      cartItem: newCard
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier :", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};




export const delete_card_product = async (req, res) => {
    const  id  = req.params.cardId; // ID du produit à supprimer

    console.log('id :', id);

    try {
        // Vérifiez si l'ID est valide
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            //console.log(' ID non valide');
            return responseReturn(res, 400, { message: "ID produit invalide." });
        }

        // Suppression du produit directement
        const deletedCard = await cardModel.findByIdAndDelete(id);
        //const card = await cardModel.findById(id);
       // console.log(' card :', card);
        if (!deletedCard) {
            return responseReturn(res, 404, { message: "Produit introuvable." });
        }

        return responseReturn(res, 200, { message: "Produit supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error.message);
        return responseReturn(res, 500, { message: "Erreur lors de la suppression du produit." });
    }
};

export const update_product_quantity = async (req, res) => {
    const id = req.params.cardId; // ID du produit à modifier
    const state = req.body.state; // Nouveau stock
    const newQuantity=req.body.newQuantity
    //console.log('id :', id);
    //console.log('state etat :', state);
    //console.log('newQuantity', newQuantity)

    try {
        // Vérifiez si l'ID est valide
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return responseReturn(res, 400, { message: "ID produit invalide." });
        }

        const product = await cardModel.findById(id);

        if (!product) {
            return responseReturn(res, 404, { message: "Produit introuvable." });
        }

        const { quantity, stock } = product;

        if (state === 'inc_cart') {
            if (quantity + 1 > stock) {
                return responseReturn(res, 400, { message: "La quantité maximale en stock est atteinte." });
            }

            await cardModel.findByIdAndUpdate(id, { quantity: quantity + 1 });
        }

        if (state === 'dec_cart') {
            if (quantity - 1 < 0) {
                return responseReturn(res, 400, { message: "La quantité ne peut pas être négative." });
            }

            await cardModel.findByIdAndUpdate(id, { quantity: quantity - 1 });
        }

        if (state==='update_cart') {
            if (quantity > stock || quantity < 1) {
                return responseReturn(res, 400, { message: `La quantité doit être comprise entre 1 et ${stock}.` });
            }
            await cardModel.findByIdAndUpdate(id, { quantity: newQuantity });
        }

        return responseReturn(res, 200, { message: "Quantité mise à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la quantité du produit :", error.message);
        return responseReturn(res, 500, { message: "Erreur lors de la mise à jour de la quantité du produit." });
    }
};

/*
export const get_card = async (req, res) => {
  const { id } = req.params;
  const commission = 0; // % commission éventuelle

  // ✅ Vérification ID utilisateur
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.log("ID utilisateur invalide :", id);
    return responseReturn(res, 400, { message: "ID invalide" });
  }

  try {
    const objectId = mongoose.Types.ObjectId.createFromHexString(id);

    // ✅ Récupérer les produits du panier avec leurs infos produit
    const cartProducts = await cardModel.aggregate([
      { $match: { customerId: objectId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" } // Pour avoir un seul objet produit par item
    ]);

    if (cartProducts.length === 0) {
      return responseReturn(res, 404, { message: "Votre panier est vide." });
    }

    // ✅ Appeler la fonction asynchrone pour traiter le panier
    const result = await processCardProducts(cartProducts, commission);

  //  console.log("Résultat panier :", result);

    return responseReturn(res, 200, result);
  } catch (error) {
    console.error("Erreur backend:", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};*/

/*
// ✅ Obtenir la position du client via son IP
async function getClientLocationFromIP(ip) {

  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);
    console.log("client data ", data)
     return {
      country: "Togo",
      countryCode: "tg",
      region: "maritime",
      city: "Lome",
      lat: 6.173703,
      lon: 1.231239
    };
  } catch (err) {
    console.error("Erreur géolocalisation IP :", err.message);
    return null; // fallback
  }
}

// ✅ Calcul dynamique des frais d’expédition
async function calculateDynamicShipping(sellerLocation, clientLocation, product) {
  try {
    if (!sellerLocation?.lat || !sellerLocation?.lon) {
      console.warn("Position vendeur manquante.");
      return 0;
    }
    if (!clientLocation?.lat || !clientLocation?.lon) {
      console.warn("Position client manquante.");
      return 0;
    }

    // ✅ Calculer la distance avec OpenStreetMap
    const routeURL = `https://router.project-osrm.org/route/v1/driving/${sellerLocation.lon},${sellerLocation.lat};${clientLocation.lon},${clientLocation.lat}?overview=false`;
    const response = await axios.get(routeURL);
    const distanceKm = response.data.routes[0].distance / 1000; // mètres ➝ km

    console.log('distance', distanceKm)

    // ✅ Exemple formule: 2$/km + 0.5$/kg
    const baseRate = 0.08 * distanceKm;
    const weightRate = (product.weight || 1) * 0.5; // fallback poids = 1kg
    const totalFee = baseRate + weightRate;

    return Math.ceil(totalFee); // arrondi
  } catch (err) {
    console.error("Erreur dynamic shipping :", err.message);
    return 0; // fallback
  }
}

export const get_card = async (req, res) => {
  const { id } = req.params;
  const commission = 0;

  // ✅ Vérification ID utilisateur
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.log("ID utilisateur invalide :", id);
    return responseReturn(res, 400, { message: "ID invalide" });
  }

  try {
    const objectId = mongoose.Types.ObjectId.createFromHexString(id);

    // ✅ Récupérer les produits du panier avec leurs infos produit
    const cartProducts = await cardModel.aggregate([
      { $match: { customerId: objectId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $lookup: {
          from: "sellers", // ✅ Charger le shopInfo du vendeur
          localField: "productInfo.sellerId",
          foreignField: "_id",
          as: "sellerInfo"
        }
      },
      { $unwind: "$sellerInfo" } // Pour avoir un seul vendeur
    ]);

    if (cartProducts.length === 0) {
      return responseReturn(res, 404, { message: "Votre panier est vide." });
    }

    // ✅ Obtenir l’adresse IP du client
    const clientIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const clientLocation = await getClientLocationFromIP(clientIP);

    // ✅ Traitement des produits et calcul des frais d’expédition
    const result = await processCardProducts(cartProducts, commission, clientLocation);

    return responseReturn(res, 200, result);
  } catch (error) {
    console.error("Erreur backend:", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};
*/

export const get_card = async (req, res) => {
  const { id } = req.params;
  const commission = 5; // % commission éventuelle

  // ✅ Vérification ID utilisateur
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.log("ID utilisateur invalide :", id);
    return responseReturn(res, 400, { message: "ID invalide" });
  }

  try {
    const objectId = mongoose.Types.ObjectId.createFromHexString(id);

    // ✅ Récupérer les produits du panier + infos produit + vendeur
    const cartProducts = await cardModel.aggregate([
      { $match: { customerId: objectId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $lookup: {
          from: "sellers", // ✅ Charger shopInfo
          localField: "productInfo.sellerId",
          foreignField: "_id",
          as: "sellerInfo",
        },
      },
      { $unwind: "$sellerInfo" },
    ]);

    if (cartProducts.length === 0) {
      return responseReturn(res, 404, { message: "Votre panier est vide." });
    }

    // ✅ Obtenir localisation client via IP
    const clientLocation = await getClientLocationFromIP(req);
   //console.log("Localisation client détectée :", clientLocation);

    // ✅ Traitement du panier
    const result = await processCardProducts(cartProducts, commission, clientLocation);

    return responseReturn(res, 200, result);
  } catch (error) {
    console.error("Erreur backend:", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};


/*
async function processCardProducts(cartProducts, commission) {
  let buyProductsTotal = 0;
  let calculatePrice = 0;
  let cartTotal = 0;
  const outOfStockProducts = [];
  const stockProducts = [];
  const sellerMap = new Map();

  for (const item of cartProducts) {
    const product = item.productInfo;

    // ✅ Valeurs par défaut depuis la variante stockée
    let stockStored = item.selectedVariant?.variantStock ?? product.stock;
    let priceStored = item.selectedVariant?.variantPrice ?? product.price;
    let imageStored = item.selectedVariant?.variantImage ?? product.thumbnail;

    // ✅ Vérification live dans productModel
    let stockLive = product.stock;
    let priceLive = product.price;
    let imageLive = product.thumbnail;

    if (item.selectedVariant) {
      const variantInProduct = product.variants.find(v =>
        v.color === item.selectedVariant.color &&
        v.size === item.selectedVariant.size
      );

      if (variantInProduct) {
        stockLive = variantInProduct.variantStock;
        priceLive = variantInProduct.variantPrice ?? product.price;
        imageLive = variantInProduct.variantImage ?? product.thumbnail;

        // ✅ Mettre à jour les infos de selectedVariant dans le panier
        await cardModel.updateOne(
          { _id: item._id },
          {
            $set: {
              "selectedVariant.variantStock": stockLive,
              "selectedVariant.variantPrice": priceLive,
              "selectedVariant.variantImage": imageLive
            }
          }
        );
      } else {
        // ❌ Variante supprimée → stock nul
        stockLive = 0;
      }
    }

    const quantity = item.quantity;

    if (stockLive < quantity) {
      // ✅ Produit hors stock
      outOfStockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockLive,
          price: priceLive,
          image: imageLive
        }
      });
    } else {
      // ✅ Produit en stock
      stockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockLive,
          price: priceLive,
          image: imageLive
        }
      });

     // console.log('stock Products', stockProducts);
     // console.log('out OfStockProducts', outOfStockProducts);

      buyProductsTotal += quantity;
      cartTotal += quantity;

      const sellerId = product.sellerId.toString();
      const shopName = product.shopName;
      const priceAfterDiscount = priceLive * (1 - (product.discount || 0) / 100);
      const finalPrice = priceAfterDiscount * (1 - commission / 100);

      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, {
          sellerId,
          shopName,
          price: 0,
          products: []
        });
      }

      const seller = sellerMap.get(sellerId);
      seller.price += finalPrice * quantity;
      seller.products.push({
        ...item,
        productInfo: {
          ...product,
          price: priceAfterDiscount,
          image: imageLive
        }
      });

      calculatePrice += finalPrice * quantity;
    }
  }

  const cardproducts= Array.from(sellerMap.values())

   //console.log('card products :', cardproducts )

  return {
    card_total: cartTotal,
    buy_products_total: buyProductsTotal,
    price: calculatePrice.toFixed(2),
    outOfStock_products: outOfStockProducts,
    card_products: Array.from(sellerMap.values()),
    shipping_fee: 85 * buyProductsTotal
  };
} */
/*
  async function processCardProducts(cartProducts, commission, clientLocation) {
  let buyProductsTotal = 0;
  let calculatePrice = 0;
  let cartTotal = 0;
  const outOfStockProducts = [];
  const stockProducts = [];
  const sellerMap = new Map();

  for (const item of cartProducts) {
    const product = item.productInfo;
    const sellerLocation = item.sellerInfo.shopInfo;

    // ✅ Vérification live dans productModel
    let stockLive = product.stock;
    let priceLive = product.price;
    let imageLive = product.thumbnail;

    if (item.selectedVariant) {
      const variantInProduct = product.variants.find(v =>
        v.color === item.selectedVariant.color &&
        v.size === item.selectedVariant.size
      );

      if (variantInProduct) {
        stockLive = variantInProduct.variantStock;
        priceLive = variantInProduct.variantPrice ?? product.price;
        imageLive = variantInProduct.variantImage ?? product.thumbnail;

        // ✅ Mettre à jour les infos dans le panier
        await cardModel.updateOne(
          { _id: item._id },
          {
            $set: {
              "selectedVariant.variantStock": stockLive,
              "selectedVariant.variantPrice": priceLive,
              "selectedVariant.variantImage": imageLive
            }
          }
        );
      } else {
        stockLive = 0; // Variante supprimée
      }
    }

    const quantity = item.quantity;

    if (stockLive < quantity) {
      outOfStockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockLive,
          price: priceLive,
          image: imageLive
        }
      });
    } else {
      stockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockLive,
          price: priceLive,
          image: imageLive
        }
      });

      buyProductsTotal += quantity;
      cartTotal += quantity;

      const sellerId = product.sellerId.toString();
      const shopName = sellerLocation.shopName;
      const deliveryType = product.deliveryType; // free, fixed, negotiable, dynamic
      const deliveryFee = product.deliveryFee ?? 0;

      const priceAfterDiscount = priceLive * (1 - (product.discount || 0) / 100);
      const finalPrice = priceAfterDiscount * (1 - commission / 100);

      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, {
          sellerId,
          shopName,
          price: 0,
          shippingFee: 0,
          deliveryType,
          products: []
        });
      }

      const seller = sellerMap.get(sellerId);

      // ✅ Calcul des frais selon deliveryType
      let shippingFee = 0;

      if (deliveryType === "free") {
        shippingFee = 0;
      } else if (deliveryType === "fixed") {
        shippingFee = deliveryFee * quantity;
      } else if (deliveryType === "negotiable") {
        shippingFee = "negotiable";
      } else if (deliveryType === "dynamic" && clientLocation) {
        shippingFee = await calculateDynamicShipping(sellerLocation, clientLocation, product);
      }

      seller.shippingFee += typeof shippingFee === "number" ? shippingFee : 0;
      seller.price += finalPrice * quantity;
      seller.products.push({
        ...item,
        productInfo: {
          ...product,
          price: priceAfterDiscount,
          image: imageLive
        }
      });

      calculatePrice += finalPrice * quantity;
    }
  }


  return {
    card_total: cartTotal,
    buy_products_total: buyProductsTotal,
    price: calculatePrice.toFixed(2),
    outOfStock_products: outOfStockProducts,
    card_products: Array.from(sellerMap.values()),
    shipping_fee: Array.from(sellerMap.values())
      .reduce((acc, s) => acc + (typeof s.shippingFee === "number" ? s.shippingFee : 0), 0)
  };
}
*/

async function processCardProducts(cartProducts, commission, clientLocation) {
  let buyProductsTotal = 0;
  let calculatePrice = 0;
  let cartTotal = 0;
  const outOfStockProducts = [];
  const stockProducts = [];
  const sellerMap = new Map();

  for (const item of cartProducts) {
    const product = item.productInfo;
    const sellerLocation = item.sellerInfo.shopInfo;

    // ✅ Vérification live stock / prix
    let stockLive = product.stock;
    let priceLive = product.price;
    let imageLive = product.thumbnail;

    if (item.selectedVariant) {
      const variantInProduct = product.variants.find(
        (v) =>
          v.color === item.selectedVariant.color &&
          v.size === item.selectedVariant.size
      );

      if (variantInProduct) {
        stockLive = variantInProduct.variantStock;
        priceLive = variantInProduct.variantPrice ?? product.price;
        imageLive = variantInProduct.variantImage ?? product.thumbnail;

        // ✅ Mettre à jour les infos dans le panier
        await cardModel.updateOne(
          { _id: item._id },
          {
            $set: {
              "selectedVariant.variantStock": stockLive,
              "selectedVariant.variantPrice": priceLive,
              "selectedVariant.variantImage": imageLive,
            },
          }
        );
      } else {
        stockLive = 0; // Variante supprimée
      }
    }

    const quantity = item.quantity;

    if (stockLive < quantity) {
      outOfStockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockLive,
          price: priceLive,
          image: imageLive,
        },
      });
    } else {
      stockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockLive,
          price: priceLive,
          image: imageLive,
        },
      });

      buyProductsTotal += quantity;
      cartTotal += quantity;

      const sellerId = product.sellerId.toString();
      const shopName = sellerLocation.shopName;
      const deliveryType = product.deliveryType; // free, fixed, negotiable, dynamic
      const deliveryFee = product.deliveryFee ?? 0;

      const priceAfterDiscount =
        priceLive * (1 - (product.discount || 0) / 100);
      const finalPrice = priceAfterDiscount * (1 - commission / 100);

      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, {
          sellerId,
          shopName,
          price: 0,
          shippingFee: 0,
          deliveryType,
          products: [],
        });
      }

      const seller = sellerMap.get(sellerId);

      // ✅ Calcul des frais selon deliveryType
      let shippingFee = 0;

      if (deliveryType === "free") {
        shippingFee = 0;
      } else if (deliveryType === "fixed") {
        shippingFee = deliveryFee * quantity; // ✅ Multiplier par quantité
      } else if (deliveryType === "negotiable") {
        shippingFee = "negotiable";
      } else if (deliveryType === "dynamic" && clientLocation) {
        shippingFee = await calculateDynamicShipping(
          sellerLocation,
          clientLocation,
          product,
          quantity
        );
      }

      seller.shippingFee +=
        typeof shippingFee === "number" ? shippingFee : 0;
      seller.price += finalPrice * quantity;
      seller.products.push({
        ...item,
        productInfo: {
          ...product,
          price: priceAfterDiscount,
          image: imageLive,
        },
      });

      calculatePrice += finalPrice * quantity;
    }
  }

  return {
    card_total: cartTotal,
    buy_products_total: buyProductsTotal,
    price: calculatePrice.toFixed(2),
    outOfStock_products: outOfStockProducts,
    card_products: Array.from(sellerMap.values()),
    shipping_fee: Array.from(sellerMap.values()).reduce(
      (acc, s) =>
        acc + (typeof s.shippingFee === "number" ? s.shippingFee : 0),
      0
    ),
  };
}


// ✅ Fonction pour recalculer le panier
export const recalculateCart = async (req, res) => {
  const { customerId, address } = req.body;

  const commission = 5

  if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
    return responseReturn(res, 400, { message: "ID client invalide." });
  }

  try {
    // ✅ Géocoder l’adresse client
    const clientLocation = await geocodeAddress(address);
    console.log("Position client (lat/lon) :", clientLocation);

    // ✅ Récupérer le panier + infos vendeur
    const cartProducts = await cardModel.aggregate([
      { $match: { customerId: mongoose.Types.ObjectId.createFromHexString(customerId) } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $lookup: {
          from: "sellers",
          localField: "productInfo.sellerId",
          foreignField: "_id",
          as: "sellerInfo"
        }
      },
      { $unwind: "$sellerInfo" },
    ]);

    if (cartProducts.length === 0) {
      return responseReturn(res, 404, { message: "Votre panier est vide." });
    }

    // ✅ Recalculer avec la position exacte
    const result = await processCardProducts(cartProducts,  commission, clientLocation);

    return responseReturn(res, 200, {
      message: "Panier recalculé avec succès.",
      ...result
    });
  } catch (err) {
    console.error("Erreur recalcul checkout:", err.message);
    return responseReturn(res, 500, { message: "Erreur lors du recalcul." });
  }
};



export const add_to_wishlist = async (req, res) => {
    //const {customerId, productId} = req.body;
    const slug = req.body.info.slug;
    //console.log(' slug', slug);
    //console.log(' req body ', req.body.info);

   try {
    const wishlist = await WishlistModel.findOne({slug});
    if (wishlist) {
      return  responseReturn(res , 404, {message: "Product already in wishlist"});
    }else {
        const wishlist = new WishlistModel({
            customerId : req.body.info.customerId,
            productId : req.body.info.productId,
            name : req.body.info.name,
            price : req.body.info.price,
            image: req.body.info.image,
            discount : req.body.info.discount,
            rating : req.body.info.rating,
            slug : req.body.info.slug,
        });
        await wishlist.save();
      return  responseReturn(res, 200, {message: "Product added to wishlist", wishlist});
    }
    
} catch (error) {
    console.log(error);
    responseReturn(res, 500, {error: error.message});
}

};


export const get_wishlist_products = async (req, res) => {
    //console.log('customerId ', req.params.customerId);
    const customerId = req.params.customerId;
    try {
        if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
           // console.log("ID utilisateur invalide :", id);
            return responseReturn(res, 400, { message: "ID invalide" });
        }
        const customerobjectId = mongoose.Types.ObjectId.createFromHexString(customerId);
        const wishlists = await WishlistModel.find({customerId: customerobjectId}).sort({ createdAt: -1 });
        if (!wishlists) {
            return responseReturn(res, 404, { message: "No wishlist found" });
        }
       // console.log('wishlist', wishlists);
        const wishList_count = await WishlistModel.countDocuments({customerId: customerobjectId});
        return responseReturn(res, 200, {message : 'wishlist found',  wishlists, wishList_count}); 
    } catch (error) {
        console.log(error);
        responseReturn(res, 500, { error: 'error fetching wishlist' });
        
    }
}

export const delete_wishlist_product = async (req, res) => {
    const  {wishlistId}  = req.params; // ID du produit à supprimer

    //console.log('wishlistId :', wishlistId);

    try {
        // Vérifiez si l'ID est valide
        if (!wishlistId || !mongoose.Types.ObjectId.isValid(wishlistId)) {
            //console.log(' ID non valide');
            return responseReturn(res, 400, { message: "ID produit invalide." });
        }

        // Suppression du produit directement
        const deletedwishlistId = await WishlistModel.findByIdAndDelete(wishlistId);
        //const card = await cardModel.findById(id);
       // console.log(' card :', card);
        if (!deletedwishlistId) {
            return responseReturn(res, 404, { message: "Produit introuvable." });
        }

        return responseReturn(res, 200, { message: "Produit supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error.message);
        return responseReturn(res, 500, { message: "Erreur lors de la suppression du produit." });
    }
};



/*
export const add_to_card = async (req, res)  => {
    const {customerId, productId, quantity} = req.body;
    try {
         // Vérifiez si l'ID est valide
         if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
            return responseReturn(res, 400, { message: "ID invalide" });
         }
          // Conversion de l'ID en ObjectId
          const customerObjectId = mongoose.Types.ObjectId.createFromHexString(customerId);
          
         if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return responseReturn(res, 400, { message: "ID invalide" });
         }

         const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId);

        const product = await cardModel.findOne({
            $and : [
               { productId: {
                        $eq : productObjectId
                    }
                },
                {
                    customerId: {
                        $eq : customerObjectId
                    }
                }

            ]

        });
        if(product){
           // const newQuantity = product.quantity + quantity;
           return responseReturn(res, 404, {message : "Product already exist in your cart"});
        }else{
            const newCard = new cardModel({ customerId, productId, quantity});
            await newCard.save();
           return responseReturn(res, 201, {message : "Product added to your cart", newCard});
        }

    } catch (error) {
        console.log(error.message)
       return responseReturn(res, 500, {message : "Internal server error"});
    }
    
}

*/

/*
export const add_to_card = async (req, res) => {
  const { customerId, productId, quantity, selectedVariant } = req.body;

  try {
           // Vérifiez si l'ID est valide
         if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
            return responseReturn(res, 400, { message: "ID invalide" });
         }
          // Conversion de l'ID en ObjectId
          const customerObjectId = mongoose.Types.ObjectId.createFromHexString(customerId);

             if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return responseReturn(res, 400, { message: "ID invalide" });
         }

         const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId);

   // const customerObjectId = mongoose.Types.ObjectId(customerId);
    //const productObjectId = mongoose.Types.ObjectId(productId);

    // ✅ Vérifier s'il existe déjà le même produit + même variante dans le panier
    const existingCard = await cardModel.findOne({
      customerId: customerObjectId,
      productId: productObjectId,
      ...(selectedVariant && selectedVariant.color ? { 'selectedVariant.color': selectedVariant.color } : {}),
      ...(selectedVariant && selectedVariant.size ? { 'selectedVariant.size': selectedVariant.size } : {})
    });

    if (existingCard) {
      return responseReturn(res, 409, { message: "Ce produit avec cette variante est déjà dans votre panier." });
    }

    // ✅ Création du nouvel élément du panier
    const newCard = new cardModel({
      customerId,
      productId,
      quantity,
      selectedVariant: selectedVariant ? {
        color: selectedVariant.color || null,
        size: selectedVariant.size || null,
        variantPrice: selectedVariant.variantPrice || null,
        variantImage: selectedVariant.variantImage || null,
        variantStock: selectedVariant.variantStock || null,
      } : undefined,
    });

    await newCard.save();

    return responseReturn(res, 201, {
      message: "Produit ajouté au panier avec succès.",
      cartItem: newCard,
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier :', error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};
*/
/*
export const add_to_card = async (req, res) => {
  const { customerId, productId, quantity, selectedVariant } = req.body;

  try {
    // ✅ Vérifier la validité des IDs
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return responseReturn(res, 400, { message: "ID client invalide." });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return responseReturn(res, 400, { message: "ID produit invalide." });
    }

    const customerObjectId = mongoose.Types.ObjectId.createFromHexString(customerId);
    const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId);

    // ✅ Chercher un produit déjà présent dans le panier avec la même variante
    const existingCard = await cardModel.findOne({
      customerId: customerObjectId,
      productId: productObjectId,
      ...(selectedVariant?.color ? { 'selectedVariant.color': selectedVariant.color } : {}),
      ...(selectedVariant?.size ? { 'selectedVariant.size': selectedVariant.size } : {})
    });

    if (existingCard) {
      // ✅ Si trouvé : mettre à jour la quantité
      existingCard.quantity += quantity;
      await existingCard.save();

      return responseReturn(res, 200, {
        message: "La quantité du produit a été mise à jour dans votre panier.",
        cartItem: existingCard,
      });
    }

    // ✅ Sinon : créer un nouvel élément dans le panier
    const newCard = new cardModel({
      customerId: customerObjectId,
      productId: productObjectId,
      quantity,
      selectedVariant: selectedVariant ? {
        color: selectedVariant.color || null,
        size: selectedVariant.size || null,
        variantPrice: selectedVariant.variantPrice || null,
        variantImage: selectedVariant.variantImage || null,
        variantStock: selectedVariant.variantStock || null,
      } : undefined,
    });

    await newCard.save();

    return responseReturn(res, 201, {
      message: "Produit ajouté au panier avec succès.",
      cartItem: newCard,
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout au panier :", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};
*/

/*
export const add_to_card = async (req, res) => {
  const { customerId, productId, quantity, selectedVariant } = req.body;

  try {
    // ✅ Vérification des IDs
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return responseReturn(res, 400, { message: "ID client invalide." });
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return responseReturn(res, 400, { message: "ID produit invalide." });
    }

    // ✅ Récupérer le produit
    const product = await Product.findById(productId);
    if (!product) {
      return responseReturn(res, 404, { message: "Produit introuvable." });
    }

    // ✅ Déterminer le stock disponible
    let stockAvailable = product.stock;
    if (selectedVariant?.variantStock != null) {
      console.log('selected variant stock', selectedVariant.variantStock);
      stockAvailable = selectedVariant.variantStock;
    }

    if (quantity > stockAvailable) {
      return responseReturn(res, 400, {
        message: `Stock insuffisant. Seulement ${stockAvailable} en stock.`
      });
    }

    const customerObjectId = mongoose.Types.ObjectId.createFromHexString(customerId);
    const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId);

    // ✅ Vérifier si le produit + variante est déjà dans le panier
    const existingCard = await cardModel.findOne({
      customerId: customerObjectId,
      productId: productObjectId,
      ...(selectedVariant?.color ? { 'selectedVariant.color': selectedVariant.color } : {}),
      ...(selectedVariant?.size ? { 'selectedVariant.size': selectedVariant.size } : {})
    });

    if (existingCard) {
      const totalQuantity = existingCard.quantity + quantity;
      if (totalQuantity > stockAvailable) {
        return responseReturn(res, 400, {
          message: `Stock insuffisant. Vous avez déjà ${existingCard.quantity} dans le panier, il reste ${stockAvailable - existingCard.quantity}.`
        });
      }

      // ✅ Mettre à jour la quantité
      existingCard.quantity = totalQuantity;
      await existingCard.save();

      return responseReturn(res, 200, {
        message: "La quantité du produit a été mise à jour dans votre panier.",
        cartItem: existingCard
      });
    }

    // ✅ Ajouter un nouveau produit au panier
    const newCard = new cardModel({
      customerId: customerObjectId,
      productId: productObjectId,
      quantity,
      selectedVariant: selectedVariant ? {
        color: selectedVariant.color || null,
        size: selectedVariant.size || null,
        variantPrice: selectedVariant.variantPrice || null,
        variantImage: selectedVariant.variantImage || null,
        variantStock: selectedVariant.variantStock || null,
      } : undefined
    });

    await newCard.save();

    return responseReturn(res, 201, {
      message: "Produit ajouté au panier avec succès.",
      cartItem: newCard
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier :", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};
*/
/*
export const add_to_card = async (req, res) => {
  const { customerId, productId, quantity, selectedVariant } = req.body;

  try {
    // ✅ Vérifier la validité des IDs
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return responseReturn(res, 400, { message: "ID client invalide." });
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return responseReturn(res, 400, { message: "ID produit invalide." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return responseReturn(res, 404, { message: "Produit introuvable." });
    }

    // ✅ Vérifier le stock réel
    let stockAvailable = product.stock;
    if (selectedVariant) {
      const variantInProduct = product.variants.find(v =>
        v.color === selectedVariant.color && v.size === selectedVariant.size
      );

      if (!variantInProduct) {
        return responseReturn(res, 400, { message: "Variante introuvable." });
      }

      stockAvailable = variantInProduct.stock;
    }

    if (quantity > stockAvailable) {
      return responseReturn(res, 400, {
        message: `Stock insuffisant. Seulement ${stockAvailable} en stock.`
      });
    }

   
    const customerObjectId = mongoose.Types.ObjectId.createFromHexString(customerId);
    const productObjectId = mongoose.Types.ObjectId.createFromHexString(productId);

    // ✅ Vérifier si le produit + variante est déjà dans le panier
    const existingCard = await cardModel.findOne({
      customerId: customerObjectId,
      productId,
      ...(selectedVariant?.color ? { 'selectedVariant.color': selectedVariant.color } : {}),
      ...(selectedVariant?.size ? { 'selectedVariant.size': selectedVariant.size } : {})
    });

    if (existingCard) {
      const totalQuantity = existingCard.quantity + quantity;

      if (totalQuantity > stockAvailable) {
        return responseReturn(res, 400, {
          message: `Stock insuffisant. Vous avez déjà ${existingCard.quantity} dans le panier, il reste ${stockAvailable - existingCard.quantity}.`
        });
      }

      existingCard.quantity = totalQuantity;
      await existingCard.save();

      return responseReturn(res, 200, {
        message: "La quantité du produit a été mise à jour dans votre panier.",
        cartItem: existingCard
      });
    }

    // ✅ Ajouter le produit au panier
    const newCard = new cardModel({
      customerId: customerObjectId,
      productId,
      quantity,
      selectedVariant: selectedVariant ? {
        color: selectedVariant.color,
        size: selectedVariant.size,
        variantPrice: selectedVariant.variantPrice || null,
        variantImage: selectedVariant.variantImage || null,
       // variantStock: selectedVariant.variantStock || null
      } : undefined
    });

    await newCard.save();

    return responseReturn(res, 201, {
      message: "Produit ajouté au panier avec succès.",
      cartItem: newCard
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier :", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};
*/

/*
export const update_product_quantity = async (req, res) => {
    const id = req.params.cardId; // ID du produit à modifier
    const state = req.body.state; // Nouveau stock
    console.log('id :', id);
  
    console.log('state etat :', state);
   try {
    // Vérifiez si l'ID est valide
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        //console.log(' ID non valide');
        return responseReturn(res, 400, { message: "ID produit invalide." });
    }
    const product = await cardModel.findById(id);
    //console.log('product :', product);
    if (!product) {
        return responseReturn(res, 404, { message: "Produit introuvable." });
    }
    const { quantity } = product;

    if (state === 'inc_cart') {
        await cardModel.findByIdAndUpdate(id,
            { 
               quantity: quantity + 1 
            });
    }

    if (state === 'dec_cart') {
        await cardModel.findByIdAndUpdate(id,
            { 
               quantity: quantity - 1 
            });
    }
    //  console.log(' quantity :', quantity);

    return responseReturn(res, 200, { message: "Quantité mise à jour avec succès ." });
   } catch (error) {
    console.error("Erreur lors de la mise à jour de la quantité du produit :", error.messag );
    return responseReturn(res, 500, { message: "Erreur lors de la mise à jour de la quantité du produit." });
   }
}
*/

/*
function processCardProducts(cartProducts, commission) {
  let buyProductsTotal = 0;
  let calculatePrice = 0;
  let cartTotal = 0;
  const outOfStockProducts = [];
  const stockProducts = [];
  const sellerMap = new Map();

  for (const item of cartProducts) {
    const product = item.productInfo;

    // ✅ Si une variante est sélectionnée
    const variant = item.selectedVariant;
    const stockAvailable = variant?.variantStock ?? product.stock;
    const unitPrice = variant?.variantPrice ?? product.price;
    const productImage = variant?.variantImage ?? product.thumbnail;
   // const stockAvailable = variant?.variantStock ?? product.productInfo?.stock;

   console.log('variant', variant)
 
    if (stockAvailable < item.quantity) {
      
      // ✅ Produit hors stock
      outOfStockProducts.push({
        ...item,
        productInfo: {
          ...product,
          price: unitPrice,
          stock: stockAvailable,
          image: productImage
        }
      });
    } else {
      // ✅ Produit en stock
     // console.log('stockAvailable', stockAvailable);
      stockProducts.push({
        ...item,
        productInfo: {
          ...product,
          price: unitPrice,
          stock: stockAvailable,
          image: productImage
        }
      });

      buyProductsTotal += item.quantity;

      const sellerId = product.sellerId.toString();
      const shopName = product.shopName;
      const priceAfterDiscount = unitPrice * (1 - (product.discount || 0) / 100);
      const finalPrice = priceAfterDiscount * (1 - commission / 100);

      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, {
          sellerId,
          shopName,
          price: 0,
          products: []
        });
      }

      const seller = sellerMap.get(sellerId);
      seller.price += finalPrice * item.quantity;
      seller.products.push({
        ...item,
        productInfo: {
          ...product,
          price: priceAfterDiscount,
          image: productImage
        }
      });

      cartTotal += item.quantity;
      calculatePrice += finalPrice * item.quantity;

     // console.log('cart_total', cartTotal);
    }
  }

  return {
    card_total: cartTotal,
    buy_products_total: buyProductsTotal,
    price: calculatePrice.toFixed(2),
    outOfStock_products: outOfStockProducts,
    card_products: Array.from(sellerMap.values()),
    shipping_fee: 85 * buyProductsTotal
  };
}
*/
/*
function processCardProducts(cartProducts, commission) {
  let buyProductsTotal = 0;
  let calculatePrice = 0;
  let cartTotal = 0;
  const outOfStockProducts = [];
  const stockProducts = [];
  const sellerMap = new Map();

  for (const item of cartProducts) {
    const product = item.productInfo;

    // ✅ Vérifier le stock réel
    let stockAvailable = product.stock;
    let unitPrice = product.price;
    let productImage = product.thumbnail;

    if (item.selectedVariant) {
      const variantInProduct = product.variants.find(v =>
        v.color === item.selectedVariant.color &&
        v.size === item.selectedVariant.size
      );

      if (variantInProduct) {
        stockAvailable = variantInProduct.stock;
        unitPrice = variantInProduct.price ?? product.price;
        productImage = variantInProduct.image ?? product.thumbnail;
      } else {
        // Variante disparue -> hors stock
        stockAvailable = 0;
      }
    }

    const quantity = item.quantity;

    if (stockAvailable < quantity) {
      // ✅ Produit hors stock
      outOfStockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockAvailable,
          price: unitPrice,
          image: productImage
        }
      });
    } else {
      // ✅ Produit en stock
      stockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockAvailable,
          price: unitPrice,
          image: productImage
        }
      });

      buyProductsTotal += quantity;
      cartTotal += quantity;

      const sellerId = product.sellerId.toString();
      const shopName = product.shopName;
      const priceAfterDiscount = unitPrice * (1 - (product.discount || 0) / 100);
      const finalPrice = priceAfterDiscount * (1 - commission / 100);

      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, {
          sellerId,
          shopName,
          price: 0,
          products: []
        });
      }

      const seller = sellerMap.get(sellerId);
      seller.price += finalPrice * quantity;
      seller.products.push({
        ...item,
        productInfo: {
          ...product,
          price: priceAfterDiscount,
          image: productImage
        }
      });

      calculatePrice += finalPrice * quantity;
    }
  }

  return {
    card_total: cartTotal,
    buy_products_total: buyProductsTotal,
    price: calculatePrice.toFixed(2),
    outOfStock_products: outOfStockProducts,
    card_products: Array.from(sellerMap.values()),
    shipping_fee: 85 * buyProductsTotal
  };
}
*/

/*

function processCardProducts(cartProducts, commission) {
  let buyProductsTotal = 0;
  let calculatePrice = 0;
  let cartTotal = 0;
  const outOfStockProducts = [];
  const stockProducts = [];
  const sellerMap = new Map();

  for (const item of cartProducts) {
    const product = item.productInfo;

    // ✅ Infos de la variante stockée
    let stockStored = item.selectedVariant?.variantStock ?? product.stock;
    let priceStored = item.selectedVariant?.variantPrice ?? product.price;
    let imageStored = item.selectedVariant?.variantImage ?? product.thumbnail;

    // ✅ Vérification live
    let stockLive = product.stock;
    let priceLive = product.price;

    if (item.selectedVariant) {
      const variantInProduct = product.variants.find(v =>
        v.color === item.selectedVariant.color &&
        v.size === item.selectedVariant.size
      );

      if (variantInProduct) {
        stockLive = variantInProduct.variantStock;
        priceLive = variantInProduct.variantPrice ?? product.price;
      } else {
        // Variante disparue → stock nul
        stockLive = 0;
      }
    }

    const quantity = item.quantity;

    if (stockLive < quantity) {
      // ✅ Produit hors stock
      outOfStockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockLive,
          price: priceLive,
          image: imageStored
        }
      });
    } else {
      // ✅ Produit en stock
      stockProducts.push({
        ...item,
        productInfo: {
          ...product,
          stock: stockLive,
          price: priceLive,
          image: imageStored
        }
      });

      buyProductsTotal += quantity;
      cartTotal += quantity;

      const sellerId = product.sellerId.toString();
      const shopName = product.shopName;
      const priceAfterDiscount = priceLive * (1 - (product.discount || 0) / 100);
      const finalPrice = priceAfterDiscount * (1 - commission / 100);

      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, {
          sellerId,
          shopName,
          price: 0,
          products: []
        });
      }

      const seller = sellerMap.get(sellerId);
      seller.price += finalPrice * quantity;
      seller.products.push({
        ...item,
        productInfo: {
          ...product,
          price: priceAfterDiscount,
          image: imageStored
        }
      });

      calculatePrice += finalPrice * quantity;
    }
  }

  return {
    card_total: cartTotal,
    buy_products_total: buyProductsTotal,
    price: calculatePrice.toFixed(2),
    outOfStock_products: outOfStockProducts,
    card_products: Array.from(sellerMap.values()),
    shipping_fee: 85 * buyProductsTotal
  };
}

*/


/*
export const get_card = async (req, res) => {
    const { id } = req.params;
    const commission = 0;

    //console.log('Request params:', req.params);

    // Vérification préliminaire de l'ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.log("ID utilisateur invalide :", id);
        return responseReturn(res, 400, { message: "ID invalide" });
    }

    try {
        const objectId = mongoose.Types.ObjectId.createFromHexString(id);

        const card_products = await cardModel.aggregate([
            { $match: { customerId: objectId } },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products",
                },
            },
        ]);

        if (card_products.length === 0) {
            return responseReturn(res, 404, { message: "Panier vide." });
        }

        // Calculs et traitements des produits...
        const result = processCardProducts(card_products, commission);

        return responseReturn(res, 200, result);
    } catch (error) {
        console.error("Erreur backend:", error);
        return responseReturn(res, 500, { message: "Erreur interne du serveur." });
    }
};
*/
/*
function processCardProducts(card_products, commission) {
    let buy_products_total = 0;
    let calculatePrice = 0;
    let card_total = 0;
    const outOfStockProducts = [];
    const stockProducts = [];
    const sellerMap = new Map();

    for (const product of card_products) {
        const productInfo = product.products[0];
        if (productInfo.stock < product.quantity) {
            outOfStockProducts.push(product);
            card_total += product.quantity;
        } else {
            stockProducts.push(product);
            buy_products_total += product.quantity;

            const tempProduct = product.products[0];
            const sellerId = tempProduct.sellerId.toString();
            const quantity = product.quantity;

            let productPrice = tempProduct.price * (1 - (tempProduct.discount || 0) / 100);
            productPrice *= (1 - commission / 100);

            if (!sellerMap.has(sellerId)) {
                sellerMap.set(sellerId, {
                    sellerId,
                    shopName: tempProduct.shopName,
                    price: 0,
                    products: [],
                });
            }

            const sellerInfo = sellerMap.get(sellerId);
            sellerInfo.price += productPrice * quantity;
            sellerInfo.products.push({ ...product, productInfo: tempProduct });

            card_total += quantity;
            calculatePrice += productPrice * quantity;
        }
    }

    return {
        card_total,
        buy_products_total,
        price: calculatePrice.toFixed(2),
        outOfStock_products: outOfStockProducts,
        card_products: Array.from(sellerMap.values()),
        shipping_fee: 85 * buy_products_total,
    };
}
*/
/*
export const get_card = async (req, res) => {
  const { id } = req.params;
  const commission = 0; // % commission éventuelle

  // ✅ Vérification ID utilisateur
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.log("ID utilisateur invalide :", id);
    return responseReturn(res, 400, { message: "ID invalide" });
  }

  try {
    const objectId = mongoose.Types.ObjectId.createFromHexString(id);

    // ✅ Récupérer les produits du panier avec les infos produit
    const cartProducts = await cardModel.aggregate([
      { $match: { customerId: objectId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" } // Pour avoir un seul objet produit
    ]);

    if (cartProducts.length === 0) {
      return responseReturn(res, 404, { message: "Votre panier est vide." });
    }

    // ✅ Traitement des produits
    const result = processCardProducts(cartProducts, commission);

    console.log('result ', result);

    return responseReturn(res, 200, result);
  } catch (error) {
    console.error("Erreur backend:", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};
*/