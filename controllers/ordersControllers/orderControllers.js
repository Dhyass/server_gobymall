
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
   console.log('order items :>> ', items);

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
            quantity : items,
            payment_status : 'unpaid',
            shippingInfo : shippingInfo,
            delivery_status : 'pending',
            date : tempDate,
        })
       
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

export const get_orders = async (req, res) => {
  // console.log('get order is running :>> req params :', req.params);
    const parPage = 5;
   
   const {customerId, status} = req.params;
   //const {pageNumber} = req.query
   //console.log(' pageNumber :>> ', req.query);
   try {
          if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
                return responseReturn(res, 400, { message: "ID invalide" });
        }
         // Conversion de l'ID en ObjectId
         const customerObjectId = mongoose.Types.ObjectId.createFromHexString(customerId);
         let myOrders = []
         if(status !== 'all'){
            myOrders = await customerOrderModel.find({
                customerId: customerObjectId, 
                delivery_status: status
            })
            .sort({createdAt: -1});
         }else{
            myOrders = await customerOrderModel.find({ customerId: customerObjectId}).
            sort({createdAt: -1});
         }

        
         const totalOrder = await customerOrderModel.countDocuments({ customerId: customerObjectId});


          // Appliquez la pagination
        const pageNumber = Number(req.query.pageNumber) || 1;
        const startIndex = (pageNumber - 1) * parPage;
        const paginatedOrders =  myOrders.slice(startIndex, startIndex + parPage);

       //  console.log(' paginatedOrders', paginatedOrders );

        // console.log('orders :>> ', orders);
         return responseReturn(res, 200, {message:'Successful Orders request', paginatedOrders, totalOrder, parPage});
    
   } catch (error) {
    console.log(error);
    return responseReturn(res, 500, { message: "Error fetching order" });
    
   }
}

export const get_dashboard_data = async (req, res) => {
   // console.log('get order is running :>> req params :', req.params);
   /* const {customerId} = req.app.get('/books/:bookId', (req, res)=>{
        res.send(req.params.bookId)
    });*/
    const {customerId} = req.params
    
    try {
        if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
            return responseReturn(res, 400, { message: "ID invalide" });
        }
     // Conversion de l'ID en ObjectId
        const customerObjectId = mongoose.Types.ObjectId.createFromHexString(customerId);
        
      const recentOrder = await customerOrderModel.find({customerId: customerObjectId}).sort({createdAt: -1}).limit(5)
        
      //console.log('dist lenght :>> ', recentOrder.length);
       
        //console.log('recent Order :>> ', recentOrder);
       
       const pendingOrder = await customerOrderModel.countDocuments({customerId: customerObjectId, delivery_status: 'pending'}).sort({createdAt: -1})
       
       //console.log('pending Order :>> ', pendingOrder);
        
       const cancelledOrder = await customerOrderModel.countDocuments({customerId: customerObjectId, delivery_status: 'cancelled'}).sort({ createdAt: -1})
        
       const totalOrder = await customerOrderModel.countDocuments({customerId: customerObjectId})
        
    
        responseReturn (res, 200, {message:'Successful Orders request', recentOrder, pendingOrder, cancelledOrder, totalOrder });
      
    } catch (error) {
        responseReturn (res, 500, { message: "Error fetching order" });
    }
}

export const get_order_by_id = async (req, res) => {
    const {orderId} = req.params;
   // console.log('get order by id is running :>> req params :', req.params);
    try {
        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return responseReturn(res, 400, { message: "ID invalide" });
        }
        const orderObjectId = mongoose.Types.ObjectId.createFromHexString(orderId);
        const order = await customerOrderModel.findById(orderObjectId);
        //console.log(' order :>> ', order);
        if (!order) {
            return responseReturn(res, 404, { message: "Order not found" });
        }
        responseReturn(res, 200, { message: "Order found", order });
        
    } catch (error) {
        console.log('error :>> ', error);
        responseReturn(res, 500, { message: "Error fetching order" });
    }
}




