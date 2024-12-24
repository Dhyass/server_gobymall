/* import moment from "moment";
import mongoose from "mongoose";
import authOrderModel from "../../models/authOrderModel.js";
import cardModel from "../../models/cardModel.js";
import customerOrderModel from "../../models/customerOrderModel.js";
import { responseReturn } from "../../utiles/response.js";

// Fonction utilitaire pour vérifier le paiement
export const payment_check = async (id) => {
    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return { success: false, message: "ID utilisateur invalide." };
        }

        const objectId = new mongoose.Types.ObjectId(id);

        const order = await customerOrderModel.findById(objectId);
        if (!order) {
            return { success: false, message: "Aucun ordre trouvé." };
        }

        if (order.payment_status === "unpaid") {
            // Annulation de la commande client
            await customerOrderModel.findByIdAndUpdate(objectId, {
                delivery_status: "cancelled",
            });

            // Annulation des commandes des vendeurs
            await authOrderModel.updateMany(
                { orderId: objectId },
                { delivery_status: "cancelled" }
            );

            return { success: true, message: "Commande annulée en raison d'un paiement non effectué." };
        }

        return { success: true, message: "Paiement vérifié avec succès." };
    } catch (error) {
        console.log("Erreur dans payment_check :", error.message);
        return { success: false, message: "Erreur lors de la vérification du paiement." };
    }
};

// Fonction principale pour passer une commande
export const place_order = async (req, res) => {
    const {
        products,
        price,
        Shipping_fees,
        shippingInfo,
        customerId,
    } = req.body;

    const tempDate = moment(Date.now()).format("LLL");
    let customerOrderProducts = [];
    let authOrderData = [];
    let cardId = [];

    try {
        // Vérification de l'ID client
        if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
            return responseReturn(res, 400, { message: "ID utilisateur invalide." });
        }

       // const userId = new mongoose.Types.ObjectId(customerId);
        // Conversion de l'ID en ObjectId
        const userId  = mongoose.Types.ObjectId.createFromHexString(customerId);

        // Organisation des produits pour la commande client
        for (let i = 0; i < products.length; i++) {
            const productList = products[i].products;
            for (let j = 0; j < productList.length; j++) {
                const tempProduct = productList[j].productInfo;
                tempProduct.quantity = productList[j].quantity;

                customerOrderProducts.push(tempProduct);

                if (productList[j]._id) {
                    cardId.push(productList[j]._id);
                }
            }
        }

        // Création de la commande client
        const order = await customerOrderModel.create({
            customerId: userId,
            products: customerOrderProducts,
            price: price + Shipping_fees,
            payment_status: "unpaid",
            shippingInfo: shippingInfo,
            delivery_status: "pending",
            date: tempDate,
        });

        // Préparation des données pour authOrderModel
        for (let i = 0; i < products.length; i++) {
            const productList = products[i].products;
            const sellerId = products[i].sellerId;
            const prix = products[i].price;

            if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
                return responseReturn(res, 400, { message: "ID vendeur invalide." });
            }

            let storeProduct = [];
            for (let j = 0; j < productList.length; j++) {
                const tempProduct = productList[j].productInfo;
                tempProduct.quantity = productList[j].quantity;
                storeProduct.push(tempProduct);
            }

            authOrderData.push({
                orderId: order.id,
                sellerId: mongoose.Types.ObjectId.createFromHexString(sellerId),
                products: storeProduct,
                price: prix,
                payment_status: "unpaid",
                shippingInfo: "Rabat, 17 rue des Olives, 10000",
                delivery_status: "pending",
                date: tempDate,
            });
        }

        // Insertion dans authOrderModel
        await authOrderModel.insertMany(authOrderData);

        // Suppression des paniers
        for (let k = 0; k < cardId.length; k++) {
            const cardIdTemp = cardId[k];
            if (mongoose.Types.ObjectId.isValid(cardIdTemp)) {
                await cardModel.findByIdAndDelete(cardIdTemp);
            }
        }

        // Vérification du paiement après 5 secondes
        setTimeout(async () => {
            const paymentResult = await payment_check(order.id);
            if (!paymentResult.success) {
                console.log(paymentResult.message);
            }
        }, 5000);

        return responseReturn(res, 201, { message: "Commande passée avec succès.", order });
    } catch (error) {
        console.log("Erreur lors de la création de la commande :", error.message);
        return responseReturn(res, 500, { message: "Erreur lors de la création de la commande." });
    }
};
*/
import moment from "moment";
import mongoose from "mongoose";
import authOrderModel from "../../models/authOrderModel.js";
import cardModel from "../../models/cardModel.js";
import customerOrderModel from "../../models/customerOrderModel.js";
import { responseReturn } from "../../utiles/response.js";

export const payment_check = async (id) => {
    try {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return { success: false, message: "ID utilisateur invalide." };
        }

        const objectId = mongoose.Types.ObjectId.createFromHexString(id);

        const order = await customerOrderModel.findById(objectId);
        if (!order) {
            return { success: false, message: "Aucun ordre trouvé." };
        }

        if (order.payment_status === "unpaid") {
            // Annulation de la commande client
            await customerOrderModel.findByIdAndUpdate(objectId, {
                delivery_status: "cancelled",
            });

            // Annulation des commandes des vendeurs
            await authOrderModel.updateMany(
                { orderId: objectId },
                { delivery_status: "cancelled" }
            );

            return { success: true, message: "Commande annulée en raison d'un paiement non effectué." };
        }

        return { success: true, message: "Paiement vérifié avec succès." };
    } catch (error) {
        console.log("Erreur dans payment_check :", error.message);
        return { success: false, message: "Erreur lors de la vérification du paiement." };
    }
};


export const place_order = async (req, res)  => {
    
    const {
        products, 
        price, 
        Shipping_fees, 
        items, 
        shippingInfo, 
        customerId
    }=req.body;
    let authOrderData = []
    let cardId = []
    const tempDate = moment(Date.now()).format('LLL')
  //  console.log('tempDate :>> ', tempDate);

  let customerOrderProducts = []

    for (let i = 0; i < products.length; i++) {
        const product = products[i].products;
        for (let j = 0; j < product.length; j++) {
            const tempProduct = product[j].productInfo;
            //console.log(`tempProduct_${i}${j} : `, tempProduct);
            customerOrderProducts.push(tempProduct)
            if (product[j]._id) {
                cardId.push(product[j]._id)
            }
        }
          
    }
    //console.log(`customer Order Products` , customerOrderProducts);    
    //console.log(`cardId `, cardId);
    try {
// Vérifiez si l'ID est valide
        if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
            //return res.status(400).json({ message: "ID utilisateur invalide." });
           return responseReturn(res, 400, { message: "ID utilisateur invalide." });
        }
        // Conversion de l'ID en ObjectId
        const userId = mongoose.Types.ObjectId.createFromHexString(customerId)

        const order = await customerOrderModel.create({
            customerId : userId,
            products: customerOrderProducts,
            price : price + Shipping_fees,
            payment_status : 'unpaid',
            shippingInfo : shippingInfo,
            delivery_status : 'pending',
            date : tempDate,
        })
       // console.log('order :>> ', order);

        /*
       for (let i = 0; i < products.length; i++) {
        const product = products[i].products;
        const prix = product[i].price;
        const Id = product[i].sellerId;

        if (!Id || !mongoose.Types.ObjectId.isValid(Id)) {
            //return res.status(400).json({ message: "ID utilisateur invalide." });
           return responseReturn(res, 400, { message: "ID utilisateur invalide." });
        }
        // Conversion de l'ID en ObjectId
        const sellerId = mongoose.Types.ObjectId.createFromHexString(Id)

        let storeProduct = []
        for (let j = 0; j < product.length; j++) {
            const tempProduct = product[j].productInfo;
            tempProduct.quantity = product[j].quantity;
            storeProduct.push(tempProduct)
        }
        await authOrderModel.create({
            orderId : order.id,
            sellerId : sellerId,
            products : storeProduct,
            price : prix,
            payment_status : 'unpaid',
            shippingInfo : 'Rabat, 17 rue des Olives, 10000',
            delivery_status : 'pending',
            date : tempDate,
            
        })

       // console.log(`authOrder ${i}`, authOrder);
        
       }
       */
       for (let i = 0; i < products.length; i++) {
        const product = products[i].products;
        const prix = products[i].price;
        const Id = products[i].sellerId;
    
        if (!Id || !mongoose.Types.ObjectId.isValid(Id)) {
            return responseReturn(res, 400, { message: "ID vendeur invalide." });
        }
    
        const sellerId = mongoose.Types.ObjectId.createFromHexString(Id);
        let storeProduct = [];
    
        for (let j = 0; j < product.length; j++) {
            const tempProduct = product[j].productInfo;
            tempProduct.quantity = product[j].quantity;
            storeProduct.push(tempProduct);
        }
    
        try {
            /*
            console.log({
                orderId: order.id,
                sellerId: sellerId,
                products: storeProduct,
                price: prix,
                payment_status: 'unpaid',
                shippingInfo: 'Rabat, 17 rue des Olives, 10000',
                delivery_status: 'pending',
                date: tempDate,
            });
            */
                authOrderData.push({
                orderId: order.id,
                sellerId: sellerId,
                products: storeProduct,
                price: prix,
                payment_status: 'unpaid',
                shippingInfo: 'Rabat, 17 rue des Olives, 10000',
                delivery_status: 'pending',
                date: tempDate,
            });
            
        } catch (err) {
            console.log("Erreur d'envoie de commandes.", err);
            return responseReturn(res, 500, { message: "Erreur d'envoie de commandes." });
        }
        
    }
    //console.log('authOrderData :>> ',  authOrderData);
    await authOrderModel.insertMany(authOrderData);

    // supprion des paniers du clien
    for (let k = 0; k < cardId.length; k++) {
        const cardIdTemp = cardId[k];
        if (!cardIdTemp || !mongoose.Types.ObjectId.isValid(cardIdTemp)) {
            return responseReturn(res, 400, { message: "ID vendeur invalide." });
        }
    
        const cardDelId = mongoose.Types.ObjectId.createFromHexString(cardIdTemp);
        await cardModel.findByIdAndDelete(cardDelId)
        
    }
    //setTimeout(()=> {this.payment_check(order.id)} , 5000);
     // Vérification du paiement après 5 secondes
     setTimeout(async () => {
        const paymentResult = await payment_check(order.id);
        if (!paymentResult.success) {
            console.log(paymentResult.message);
        }
    }, 5000);

    return responseReturn(res, 201, { 
        message: "order placed successfully", 
        orderId : order.id,
    });
        
    } catch (error) {
        console.log(error);
        return responseReturn(res, 500, { message: "Error placing order" });
        
    }
    
    
}
