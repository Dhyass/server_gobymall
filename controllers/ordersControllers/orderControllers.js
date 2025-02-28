
import moment from "moment";
import mongoose from "mongoose";
import Stripe from 'stripe'; // Assure-toi que tu utilises une version compatible ES Modules.
import authOrderModel from "../../models/authOrderModel.js";
import cardModel from "../../models/cardModel.js";
import customerOrderModel from "../../models/customerOrderModel.js";
import myShopWalletSchemaModel from "../../models/myShopWalletModel.js";
import sellerWalletModel from "../../models/sellerWalletModel.js";
import { responseReturn } from "../../utiles/response.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Utilise la clé depuis l'environnement.


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
            tempProduct.quantity = product[j].quantity;
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
        
    
       return responseReturn (res, 200, {message:'Successful Orders request', recentOrder, pendingOrder, cancelledOrder, totalOrder });
      
    } catch (error) {
       return responseReturn (res, 500, { message: "Error fetching order" });
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
        console.log(' order :>> ', order);
        if (!order) {
            return responseReturn(res, 404, { message: "Order not found" });
        }
      return  responseReturn(res, 200, { message: "Order found", order });
        
    } catch (error) {
        console.log('error :>> ', error);
       return responseReturn(res, 500, { message: "Error fetching order" });
    }
}


export const get_admin_orders = async(req,res)=>{
    //console.log('req query', req.query);
    let {page,searchValue, parPage} = req.query;
    page = parseInt(page)
    parPage = parseInt(parPage)

    const skipPage = parPage*(page-1)

    try {
        if (searchValue) {
            
        } else {
            const orders = await customerOrderModel.aggregate([
                {
                    $lookup: {
                        from :'authorders',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'subOrder'
                    }
                }
            ]).skip(skipPage).limit(parPage).sort({createdAt: -1});

            const totalOrder = await customerOrderModel.countDocuments([
                {
                    $lookup: {
                        from :'authorders',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'subOrder'
                    }
                }
            ]);

           // console.log('orders', orders);
            return responseReturn(res, 200, { orders, totalOrder });
        }
    } catch (error) {
        console.log('error :>> ', error);
        return responseReturn(res, 500, { message: "Error fetching orders" });
    }
}

export const get_admin_order_by_ID = async(req, res)=>{
    //console.log('params ', req.params)
   const {orderId} = req.params;

   try {
        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return responseReturn(res, 400, { message: "ID invalide" });
        }
        const orderObjectId = mongoose.Types.ObjectId.createFromHexString(orderId);
        const order = await customerOrderModel.aggregate([
            {
                $match : {_id: orderObjectId}
            },
            
                {
                    $lookup: {
                        from :'authorders',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'subOrder'
                    }
                }
        ])
       // console.log('order ', order)
        return responseReturn( res, 200, { order:order[0]});
   } catch (error) {
         console.log('error :>> ', error);
        return responseReturn(res, 500, { message: "Error fetching order" });
   }
}

export const admin_order_status_update = async(req, res)=>{
    const {status} = req.body;
    const {orderId} = req.params;
   // console.log('req.body :>> ', req.body);
   // console.log('req params ', req.params);
   try {
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        return responseReturn(res, 400, { message: "ID invalide" });
    }
    const orderObjectId = mongoose.Types.ObjectId.createFromHexString(orderId);
    const order = await customerOrderModel.findByIdAndUpdate(orderObjectId,{
        delivery_status :status
    })
    if(!order){
        return responseReturn(res, 404, { message: "Order not found" });
    }
    return responseReturn(res, 200, { message: "Order status updated successfully"});
   } catch (error) {
    console.log('error :>> ', error);
    return responseReturn(res, 500, { message: "Error updating order status" });
   }
}


export const get_seller_orders = async(req,res)=>{
    //console.log('req query', req.query);
    //console.log('req params ', req.params);
    const {sellerId} = req.params;
    let {page,searchValue, parPage} = req.query;
    page = parseInt(page)
    parPage = parseInt(parPage)

    const skipPage = parPage*(page-1)

    try {
        if (searchValue) {
            
        } else {
            const orders = await authOrderModel.find({sellerId}).skip(skipPage).limit(parPage).sort({createdAt: -1});
            const totalOrders = await authOrderModel.countDocuments({sellerId});
           // console.log('orders :>> ', orders);
            return responseReturn(res, 200, { orders, totalOrders });
        }
    } catch (error) {
        console.log('error :>> ', error);
        return responseReturn(res, 500, { message: "Error fetching orders" });
    }
}

export const get_seller_order_by_ID = async(req, res)=>{
   // console.log('params ', req.params)
   const {orderId} = req.params;
   try {
    /*if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        return responseReturn(res, 400, { message: "ID invalide" });
    }
    const orderObjectId = mongoose.Types.ObjectId.createFromHexString(orderId);*/
    const order = await authOrderModel.findById(orderId)
   //console.log('order ', order)
    return responseReturn( res, 200, { order:order});
} catch (error) {
     console.log('error :>> ', error);
    return responseReturn(res, 500, { message: "Error fetching order" });
}
}

export const seller_order_status_update = async(req, res)=>{
    const {status} = req.body;
    const {orderId} = req.params;
   //console.log('req.body :>> ', req.body);
  // console.log('req params ', req.params);
   try {
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        return responseReturn(res, 400, { message: "ID invalide" });
    }
    const orderObjectId = mongoose.Types.ObjectId.createFromHexString(orderId);
    const order = await authOrderModel.findByIdAndUpdate(orderObjectId,{
        delivery_status :status
    })
    if(!order){
        return responseReturn(res, 404, { message: "Order not found" });
    }
    return responseReturn(res, 200, { message: "Order status updated successfully"});
   } catch (error) {
    console.log('error :>> ', error);
    return responseReturn(res, 500, { message: "Error updating order status" });
   }
}
/*
export const create_payment = async (req, res) => {
    const { price } = req.body;

    console.log('Price received in request:', price);

    // Validate the price
    if (!price || isNaN(price) || price <= 0) {
        return responseReturn(res, 400, { message: "Invalid price provided" });
    }

    try {
        const payment = await stripe.paymentIntents.create({
            amount: Math.round(price * 100), // Convert to smallest currency unit
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log('Payment Intent created:', payment);
        return responseReturn(res, 200, { clientSecret: payment.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return responseReturn(res, 500, { message: "Error creating payment" });
    }
};
*/

export const create_payment = async (req, res) => {
    const { price } = req.body;

    //console.log('Price received in request:', price);

    // Validate the price
    if (!price || isNaN(price) || price <= 0) {
       // console.error("Invalid price received:", price);
        return res.status(400).json({ message: "Invalid price provided" });
    }

    try {
        const payment = await stripe.paymentIntents.create({
            amount: Math.round(price * 100), // Convert price to cents
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
        });

       // console.log('Payment Intent created:', payment);
        res.status(200).json({ clientSecret: payment.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: "Error creating payment" });
    }
};


export const order_confirm = async(req, res)=>{
    const {orderId} = req.params;
    //console.log('order id ', orderId);
    try {
        await customerOrderModel.findByIdAndUpdate(orderId, 
            {
                payment_status:'paid',
                delivery_status:'pending'
            })
            if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
                return responseReturn(res, 400, { message: "ID invalide" });
            }
            const orderObjectId = mongoose.Types.ObjectId.createFromHexString(orderId);
            const order = await authOrderModel.updateMany({orderId : orderObjectId},{
                payment_status:'paid',
                delivery_status:'pending'
            })
            const customerOrder = await customerOrderModel.findById(orderId)
            const authOrder = await authOrderModel.find({orderId : orderObjectId})
            const time = moment(Date.now()).format('l')
            const splitTime = time.split('/')

            await myShopWalletSchemaModel.create({
                amount : customerOrder.price,
                month : splitTime[0],
                year : splitTime[2]
            })

            for (let i = 0; i < authOrder.length; i++) {
                await sellerWalletModel.create({
                    sellerId : authOrder[i].sellerId.toString(),
                    amount : authOrder[i].price,
                    month : splitTime[0],
                    year : splitTime[2]
                })
                
            }

            return responseReturn(res, 200, {message : 'success'});
    } catch (error) {
        console.log('error :>> ', error);
        return responseReturn(res, 500, { message: "Error confirm order" });
    }
}