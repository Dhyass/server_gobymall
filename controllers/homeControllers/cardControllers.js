
import mongoose from "mongoose";
import cardModel from "../../models/cardModel.js";
import { responseReturn } from "../../utiles/response.js";


export const add_to_card = async (req, res)  => {
    const {customerId, productId, quantity} = req.body;
    try {
        const product = await cardModel.findOne({
            $and : [
               { productId: {
                        $eq : productId
                    }
                },
                {
                    customerId: {
                        $eq : customerId
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


/*
export const get_card = async (req, res) => {
    const { id } = req.params;
   // console.log('id reçu :', id);
   const commission = 5;

    try {
        // Conversion de l'id reçu en ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        const card_products = await cardModel.aggregate([
            {
                $match: {
                    customerId: objectId, // Comparaison avec ObjectId
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products",
                }
            }
        ]);

        //console.log('Produits du panier :', card_products);
        let calculatePrice = 0;
        let card_total = 0;
        const outOfStockProduct = card_products.filter(product=>product.products[0].stock < product.quantity);
        for (let i = 0; i < outOfStockProduct.length; i++) {
            card_total += outOfStockProduct[i].quantity
        }
       // console.log('out OfStockProduct :', outOfStockProduct);
       //console.log('card _total :', card_total);

       const stockProducts = card_products.filter(product=>product.products[0].stock >= product.quantity);
       //console.log('stock Products :', stockProducts);
       for (let i = 0; i < stockProducts.length; i++) {
                const {quantity} = stockProducts[i];
                card_total += quantity;
            const {price, discount} = stockProducts[i].products[0];
            if (discount!==0) {
                calculatePrice +=(price * quantity) *(1 - (discount/100));
            } else {
                calculatePrice += price * quantity;
            }
       }
       
       //console.log('card _total :', card_total);
       //console.log('stockProducts[i].products[0] :', stockProducts[0].products[0]);
      // console.log('calculatePrice :', calculatePrice);

       let p = [];
       let unique = [... new Set(stockProducts.map(p=>p.products[0].sellerId.toString()))]

       for (let i = 0; i < unique.length; i++) {
        let price = 0;
        for (let j = 0; j < stockProducts.length; j++) {
            const tempProducts = stockProducts[j].products[0];

            if (unique[j]===tempProducts[j].products[0].sellerId.toString()) {
                let prix =0;
                if (tempProducts.discount !==0) {
                    prix = tempProducts.price * (1 - (tempProducts.discount/100));
                }else {
                    prix = tempProducts.price ;
                }
                prix = prix*(1-commission/100)
                price += prix*stockProducts[j].quantity;
                p[i] = {
                    sellerId: unique[i],
                    shopName : tempProducts.shopName,
                    price,
                    //quantity: stockProducts[i].quantity
                    products : p[i] ? [...p[i].products, 
                    {
                        _id : stockProducts[j]._id,
                        quantity : stockProducts[j].quantity,
                        productInfo : tempProducts,
                    }
                ] : [
                    {
                        _id : stockProducts[j]._id,
                        quantity : stockProducts[j].quantity,
                        productInfo : tempProducts,
                    }
                ]
                }
            }
            
            console.log('tempProdcuts :', tempProducts);
        }
        
       }

       //console.log(stockProducts[0].products[0].sellerId.toString())
       //console.log('unique :', unique);

        console.log('card _total :', card_total);
        console.log('out OfStockProduct :', outOfStockProduct);
       
         console.log('calculatePrice :', calculatePrice);

        if (card_products.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé pour cet utilisateur." });
        }

        return res.status(200).json({ products: card_products });
    } catch (error) {
        console.error("Erreur lors de la récupération des produits du panier :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
*/
/*
export const get_card = async (req, res) => {
    const { id } = req.params;
    const commission = 5;

    try {
        // Conversion de l'ID reçu en ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // Récupération des produits du panier
        const card_products = await cardModel.aggregate([
            {
                $match: {
                    customerId: objectId, // Comparaison avec ObjectId
                },
            },
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
            return res.status(404).json({ message: "Aucun produit trouvé pour cet utilisateur." });
        }

        let calculatePrice = 0; // Prix total des produits en stock
        let card_total = 0; // Total des quantités
        const outOfStockProducts = []; // Produits en rupture de stock
        const stockProducts = []; // Produits en stock

        // Séparer les produits en stock et hors stock
        for (const product of card_products) {
            const productInfo = product.products[0];
            if (productInfo.stock < product.quantity) {
                outOfStockProducts.push(product);
                card_total += product.quantity; // Inclure même les produits hors stock dans le total
            } else {
                stockProducts.push(product);
            }
        }

        // Calculer le prix total et regrouper par vendeur
        const p = [];
        const uniqueSellers = [...new Set(stockProducts.map(product => product.products[0].sellerId.toString()))];

        for (const sellerId of uniqueSellers) {
            let price = 0;
            const sellerProducts = stockProducts.filter(
                product => product.products[0].sellerId.toString() === sellerId
            );

            for (const product of sellerProducts) {
                const tempProduct = product.products[0];
                const quantity = product.quantity;

                let productPrice = tempProduct.price;
                if (tempProduct.discount !== 0) {
                    productPrice *= 1 - tempProduct.discount / 100;
                }

                productPrice *= (1 - commission / 100);
                price += productPrice * quantity;

                p.push({
                    sellerId,
                    shopName: tempProduct.shopName,
                    price,
                    products: p.find(seller => seller.sellerId === sellerId)
                        ? [
                              ...p.find(seller => seller.sellerId === sellerId).products,
                              {
                                  _id: product._id,
                                  quantity,
                                  productInfo: tempProduct,
                              },
                          ]
                        : [
                              {
                                  _id: product._id,
                                  quantity,
                                  productInfo: tempProduct,
                              },
                          ],
                });
            }
        }

        // Calculer le prix total pour tous les produits en stock
        for (const product of stockProducts) {
            const tempProduct = product.products[0];
            const quantity = product.quantity;

            card_total += quantity;

            if (tempProduct.discount !== 0) {
                calculatePrice += (tempProduct.price * quantity) * (1 - tempProduct.discount / 100);
            } else {
                calculatePrice += tempProduct.price * quantity;
            }
        }
       // console.log('card _total', card_total);
       // console.log('calculatePrice', calculatePrice);
       // console.log('out of stock', outOfStockProducts);
        //console.log('p', p);

        // Résultat final
        return responseReturn(res, 200, {
            card_total,
            price : calculatePrice,
            outOfStock_products :outOfStockProducts,
            //stockProducts,
           // groupedBySeller: p,
            card_products : p,
            shipping_fee : 85*p.length,
        });
       
    } catch (error) {
        console.error("Erreur lors de la récupération des produits du panier :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
*/
/*
export const get_card = async (req, res) => {
    const { id } = req.params;
    const commission = 5;

    try {
        // Conversion de l'ID reçu en ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // Récupération des produits du panier
        const card_products = await cardModel.aggregate([
            {
                $match: {
                    customerId: objectId, // Comparaison avec ObjectId
                },
            },
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
            return res.status(404).json({ message: "Aucun produit trouvé pour cet utilisateur." });
        }

        let calculatePrice = 0; // Prix total des produits en stock
        let card_total = 0; // Total des quantités
        const outOfStockProducts = []; // Produits en rupture de stock
        const stockProducts = []; // Produits en stock

        // Séparer les produits en stock et hors stock
        for (const product of card_products) {
            const productInfo = product.products[0];
            if (productInfo.stock < product.quantity) {
                outOfStockProducts.push(product);
                card_total += product.quantity; // Inclure même les produits hors stock dans le total
            } else {
                stockProducts.push(product);
            }
        }

        // Calculer le prix total et regrouper par vendeur
        const sellerMap = new Map(); // Utilisation d'une Map pour éviter les duplications

        for (const product of stockProducts) {
            const tempProduct = product.products[0];
            const sellerId = tempProduct.sellerId.toString();
            const quantity = product.quantity;

            let productPrice = tempProduct.price;
            if (tempProduct.discount !== 0) {
                productPrice *= 1 - tempProduct.discount / 100;
            }
            productPrice *= (1 - commission / 100);

            // Mettre à jour les informations du vendeur
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
            sellerInfo.products.push({
                _id: product._id,
                quantity,
                productInfo: tempProduct,
            });

            card_total += quantity; // Mise à jour du total des quantités
            calculatePrice += productPrice * quantity; // Mise à jour du prix total
        }

        // Conversion des informations des vendeurs en tableau
        const p = Array.from(sellerMap.values());

        // Résultat final
        return responseReturn(res, 200, {
            card_total,
            price: calculatePrice,
            outOfStock_products: outOfStockProducts,
            card_products: p,
            shipping_fee: 85 * p.length,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des produits du panier :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
*/


export const get_cards = async (req, res) => {
    const { id } = req.params;
    const commission = 0;

    console.log(' request params', req.params);

    try {
        // Vérifiez si l'ID est valide
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            //return res.status(400).json({ message: "ID utilisateur invalide." });
           return responseReturn(res, 400, { message: "ID utilisateur invalide from backend" });
        }

        // Conversion de l'ID en ObjectId
        const objectId = mongoose.Types.ObjectId.createFromHexString(id);

        // Récupération des produits du panier
        const card_products = await cardModel.aggregate([
            {
                $match: {
                    customerId: objectId, // Comparaison avec ObjectId
                },
            },
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
            //return res.status(404).json({ message: "Aucun produit trouvé pour cet utilisateur." });
           return responseReturn(res , 404, { message: "Aucun produit trouvé pour cet utilisateur." });
        }

        let buy_products_total = 0; // Total des produits achetés (en stock uniquement)
        let calculatePrice = 0; // Prix total des produits en stock
        let card_total = 0; // Total des quantités
        const outOfStockProducts = []; // Produits en rupture de stock
        const stockProducts = []; // Produits en stock

        // Séparer les produits en stock et hors stock
        for (const product of card_products) {
            const productInfo = product.products[0];
            if (productInfo.stock < product.quantity) {
                outOfStockProducts.push(product);
                card_total += product.quantity; // Inclure même les produits hors stock dans le total
            } else {
                stockProducts.push(product);
                buy_products_total += product.quantity; // Ajouter uniquement les produits en stock
            }
        }

        // Calculer le prix total et regrouper par vendeur
        const sellerMap = new Map();

        for (const product of stockProducts) {
            const tempProduct = product.products[0];
            const sellerId = tempProduct.sellerId.toString();
            const quantity = product.quantity;

            let productPrice = tempProduct.price;
            if (tempProduct.discount !== 0) {
                productPrice *= 1 - tempProduct.discount / 100;
            }
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
            sellerInfo.products.push({
                _id: product._id,
                quantity,
                productInfo: tempProduct,
            });

            card_total += quantity;
           calculatePrice += productPrice * quantity;
          // calculatePrice += Math.round((productPrice * quantity) * 100) / 100;
        }

        //console.log('buy _products_total:', buy_products_total);

        const p = Array.from(sellerMap.values());

        return responseReturn(res, 200, {
            card_total,
            buy_products_total, // Ajout du total des produits à acheter
            price: calculatePrice.toFixed(2),
            outOfStock_products: outOfStockProducts,
            card_products: p,
            //shipping_fee: 85 * p.length,
            shipping_fee: 85 *buy_products_total,

        });
    } catch (error) {
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
export const update_product_quantity = async (req, res) => {
    const id = req.params.cardId; // ID du produit à modifier
    const state = req.body.state; // Nouveau stock
    console.log('id :', id);
    console.log('state etat :', state);

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

        return responseReturn(res, 200, { message: "Quantité mise à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la quantité du produit :", error.message);
        return responseReturn(res, 500, { message: "Erreur lors de la mise à jour de la quantité du produit." });
    }
};


export const get_card = async (req, res) => {
    const { id } = req.params;
    const commission = 0;

    console.log('Request params:', req.params);

    // Vérification préliminaire de l'ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.log("ID utilisateur invalide :", id);
        return responseReturn(res, 400, { message: "ID utilisateur invalide from backend" });
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
            return responseReturn(res, 404, { message: "Aucun produit trouvé pour cet utilisateur." });
        }

        // Calculs et traitements des produits...
        const result = processCardProducts(card_products, commission);

        return responseReturn(res, 200, result);
    } catch (error) {
        console.error("Erreur backend:", error);
        return responseReturn(res, 500, { message: "Erreur interne du serveur." });
    }
};

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
