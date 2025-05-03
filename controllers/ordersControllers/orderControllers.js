
import moment from "moment";
import mongoose from "mongoose";
import Stripe from 'stripe'; // Assure-toi que tu utilises une version compatible ES Modules.
import authOrderModel from "../../models/authOrderModel.js";
import cardModel from "../../models/cardModel.js";
import customerOrderModel from "../../models/customerOrderModel.js";
import myShopWalletSchemaModel from "../../models/myShopWalletModel.js";
import productModel from "../../models/productModel.js";
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
   //console.log('order items :>> ', items);

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
           
                authOrderData.push({
                orderId: order.id,
                sellerId: sellerId,
                products: storeProduct,
                price: prix,
                payment_status: 'unpaid',
                shippingInfo : shippingInfo,
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
            return responseReturn(res, 404, {message: paymentResult.message})
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
      // console.log(' order :>> ', order);
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
/*

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
           // console.log('customer order ', customerOrder)

            const authOrder = await authOrderModel.find({orderId : orderObjectId})
            const time = moment(Date.now()).format('l')
            const splitTime = time.split('/')

            await myShopWalletSchemaModel.create({
                amount : customerOrder.price,
                month : splitTime[0],
                year : splitTime[2]
            })
            
            let product = {}

            if (customerOrder.payment_status === 'paid') {
                for (let index = 0; index < customerOrder.products.length; index++) {
                    product = customerOrder.products[index]
                    const newQuantity = product.stock-product.quantity
                    console.log("new quantity ", newQuantity)
                    product = await productModel.findByIdAndUpdate(product._id, {
                        quantity :  newQuantity
                    })
                }    
            }

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
}*/

export const order_confirm = async (req, res) => {
    const { orderId } = req.params;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        return responseReturn(res, 400, { message: "ID invalide" });
    }

    try {
        const orderObjectId = mongoose.Types.ObjectId.createFromHexString(orderId);

        // Mettre à jour les statuts
        await customerOrderModel.findByIdAndUpdate(orderId, {
            payment_status: 'paid',
            delivery_status: 'pending'
        });

        await authOrderModel.updateMany({ orderId: orderObjectId }, {
            payment_status: 'paid',
            delivery_status: 'pending'
        });

        const customerOrder = await customerOrderModel.findById(orderId);
        const authOrder = await authOrderModel.find({ orderId: orderObjectId });

        // Créer un enregistrement dans le wallet global
        const time = moment().format('l').split('/');
        await myShopWalletSchemaModel.create({
            amount: customerOrder.price,
            month: time[0],
            year: time[2]
        });

        // ✅ Mettre à jour la quantité des produits
        if (customerOrder.payment_status === 'paid') {
            for (let item of customerOrder.products) {
                const productData = await productModel.findById(item._id);

               // console.log('pduct Data :>> ', productData);


                if (!productData) continue;

                const newQuantity = productData.stock - item.quantity;

              //  console.log('new Quantity :>> ', newQuantity);

                await productModel.findByIdAndUpdate(item._id, {
                    stock: newQuantity > 0 ? newQuantity : 0
                });
            }
        }

        // Crédits pour chaque vendeur
        for (let i = 0; i < authOrder.length; i++) {
            await sellerWalletModel.create({
                sellerId: authOrder[i].sellerId.toString(),
                amount: authOrder[i].price,
                month: time[0],
                year: time[2]
            });
        }

        return responseReturn(res, 200, { message: 'Commande confirmée avec succès' });

    } catch (error) {
        console.log('Erreur lors de la confirmation de commande :', error);
        return responseReturn(res, 500, { message: "Erreur lors de la confirmation de la commande" });
    }
};


/*
    dans le order j'ai products type array, qui contient pluisieurs produits, et je veux pouvoir motifier la quantité du produit
    en utilisant son id (productId).
    Par ailleurs, lorsqu'un utilissateur place une commande, on regroupe les produits selon les vendeurs, et le prix total de produits 
    du vendeur commandés. essaye de corriger le code
*/
/*
export const updateOrderProductQuantity = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.body.productId;
    const newQuantity = req.body.newQuantity;
    const sellerId = req.body.sellerId

    console.log('orderId  :', orderId );
    console.log('productId  :', productId );
    console.log('newQuantity :', newQuantity);
    console.log('sellerId :', sellerId)

    try {
        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return responseReturn(res, 400, { message: "ID invalide" });
        }

        const order = await customerOrderModel.findById(orderId);

        const orderAuth = await authOrderModel.findById(orderId);

        if (!order || !orderAuth) {
            return responseReturn(res, 404, { message: "Commande non trouvée." });
        }

        const productToUpdate = order.products.find(p => p._id.toString() === productId);

        if (!productToUpdate) {
            return responseReturn(res, 404, { message: "Produit non trouvé dans la commande." });
        }

        if (newQuantity < 1 || newQuantity > productToUpdate.stock) {
            return responseReturn(res, 400, {
                message: `La quantité doit être comprise entre 1 et ${productToUpdate.stock}.`
            });
        }

        let prixToUpdate =0;
        let prcieAuthToUpdate =0;
        const priceDiscounted = (productToUpdate.price-(productToUpdate.price*productToUpdate.discount/100))

        if (newQuantity>productToUpdate.quantity) {

            prixToUpdate = order.price + (newQuantity-productToUpdate.quantity)*priceDiscounted
            prcieAuthToUpdate = orderAuth.price + (newQuantity-productToUpdate.quantity)*priceDiscounted
        } 
        if (newQuantity<productToUpdate.quantity) {
            prixToUpdate = order.price - (productToUpdate.quantity-newQuantity)*priceDiscounted
            prcieAuthToUpdate = orderAuth.price - (productToUpdate.quantity-newQuantity)*priceDiscounted
        }

        console.log('prix to update', prixToUpdate)
        console.log('price auth order update', prcieAuthToUpdate )

        if (order.payment_status==='unpaid') {
            
            await customerOrderModel.updateOne(
                { _id: orderId, "products._id": productId },
                {
                    $set: {
                        "products.$.quantity": newQuantity
                    }
                },
                
            );

            await customerOrderModel.findByIdAndUpdate(orderId, {
                price: parseFloat(prixToUpdate).toFixed(2)
            }   
            )

            

            await authOrderModel.updateOne(
                { orderId: orderId, "products._id": productId },
                {
                    $set: {
                        "products.$.quantity": newQuantity
                    },
                },
                {
                    $set:{
                        "price":parseFloat(prcieAuthToUpdate).toFixed(2)
                    }
                }
              
            );

         
        }

        return responseReturn(res, 200, { message: "Quantité mise à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error.message);
        return responseReturn(res, 500, { message: "Erreur interne du serveur." });
    }
};
*/

export const updateOrderProductQuantity = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.body.productId;
    const newQuantity = req.body.newQuantity;
    const sellerId = req.body.sellerId;
    /*
    console.log('orderId  :', orderId);
    console.log('productId  :', productId);
    console.log('newQuantity :', newQuantity);
    console.log('sellerId :', sellerId);*/

    try {
        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return responseReturn(res, 400, { message: "ID invalide" });
        }

        const order = await customerOrderModel.findById(orderId);
        const authOrder = await authOrderModel.findOne({ orderId, sellerId });

       // console.log('authOrder :', authOrder)

        if (!order || !authOrder) {
            return responseReturn(res, 404, { message: "Commande non trouvée." });
        }

        const productToUpdate = order.products.find(p => p._id.toString() === productId);
        const authProductToUpdate = authOrder.products.find(p => p._id.toString() === productId);

        if (!productToUpdate || !authProductToUpdate) {
            return responseReturn(res, 404, { message: "Produit non trouvé dans la commande." });
        }

        if (newQuantity < 1 || newQuantity > productToUpdate.stock) {
            return responseReturn(res, 400, {
                message: `La quantité doit être comprise entre 1 et ${productToUpdate.stock}.`
            });
        }

        // Calcul du nouveau prix
        const priceDiscounted = productToUpdate.price - (productToUpdate.price * productToUpdate.discount / 100);
        const delta = newQuantity - productToUpdate.quantity;

        const updatedOrderPrice = order.price + (delta * priceDiscounted);
        const updatedAuthPrice = authOrder.price + (delta * priceDiscounted);

       // console.log('updatedAuthPrice :', updatedAuthPrice)

        // Mise à jour uniquement si la commande est impayée
        if (order.payment_status === 'unpaid') {
            // Met à jour la quantité dans la commande principale
            await customerOrderModel.updateOne(
                { _id: orderId, "products._id": productId },
                {
                    $set: {
                        "products.$.quantity": newQuantity
                    }
                }
            );

            // Met à jour le prix global de la commande principale
            await customerOrderModel.findByIdAndUpdate(orderId, {
                price: parseFloat(updatedOrderPrice).toFixed(2)
            });

            // Met à jour la quantité dans la commande par vendeur
           await authOrderModel.updateOne(
                { orderId, sellerId, "products._id": productId },
                {
                    $set: {
                        "products.$.quantity": newQuantity,
                        //price : parseFloat(updatedAuthPrice).toFixed(2)
                    }
                }
            );
            await authOrderModel.updateOne(
                { orderId, sellerId,},
                {
                    $set: {
                        price : parseFloat(updatedAuthPrice).toFixed(2)
                    }
                }
            );

        }

        return responseReturn(res, 200, { message: "Quantité mise à jour avec succès." });
    } catch (error) {
        //console.error("Erreur lors de la mise à jour :", error.message);
        return responseReturn(res, 500, { message: "Erreur interne du serveur." });
    }
};


/*
je veux maintenant pourvoir suprimer un produit dans une commande , de (customerOrderModel et de authOrderModel ),
lorsque tous les produits de la commande sont supprimés; la commande (order global ou order specifique au vendeur) est 
automatiquement suprimée 

export const delete_Order = async(req, res)=>{
    const orderId = req.params.orderId
    const productId =req.params.productId
    const sellerid = req.body.sellerId
}
*/  


export const delete_Order = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    const sellerId = req.params.sellerId;

    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return responseReturn(res, 400, { message: "ID de commande invalide." });
        }

        const order = await customerOrderModel.findById(orderId);
        const authOrder = await authOrderModel.findOne({ orderId, sellerId });

        if (!order || !authOrder) {
            return responseReturn(res, 404, { message: "Commande non trouvée." });
        }

        // Vérifie si le produit existe dans les deux modèles
        const productInOrder = order.products.find(p => p._id.toString() === productId);
        const productInAuthOrder = authOrder.products.find(p => p._id.toString() === productId);

        if (!productInOrder || !productInAuthOrder) {
            return responseReturn(res, 404, { message: "Produit non trouvé dans la commande." });
        }

        // Calcule le montant à soustraire
        const priceDiscounted = productInOrder.price - (productInOrder.price * productInOrder.discount / 100);
        const totalReduction = productInOrder.quantity * priceDiscounted;

        // Supprimer le produit de customerOrderModel
        const orderUpdateResult = await customerOrderModel.updateOne(
            { _id: orderId },
            {
                $pull: { products: { _id: productId } },
                $inc: { price: -totalReduction }
            }
        );

        // Supprimer le produit de authOrderModel
        const authUpdateResult = await authOrderModel.updateOne(
            { orderId, sellerId },
            {
                $pull: { products: { _id: productId } },
                $inc: { price: -totalReduction }
            }
        );

        // Vérification que les suppressions ont bien été appliquées
        const updatedOrder = await customerOrderModel.findById(orderId);
        const updatedAuthOrder = await authOrderModel.findOne({ orderId, sellerId });

        let orderDeleted = false;
        let authOrderDeleted = false;

        if (updatedOrder?.products.length === 0) {
            await customerOrderModel.findByIdAndDelete(orderId);
            orderDeleted = true;
        }

        if (updatedAuthOrder?.products.length === 0) {
            await authOrderModel.deleteOne({ orderId, sellerId });
            authOrderDeleted = true;
        }

        return responseReturn(res, 200, {
            message: orderDeleted
                ? "Produit supprimé. La commande a été supprimée car elle ne contenait plus aucun produit."
                : "Produit supprimé avec succès.",
            orderDeleted,
            authOrderDeleted,
            productId
        });

    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error.message);
        return responseReturn(res, 500, { message: "Erreur serveur." });
    }
};
