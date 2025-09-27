
import moment from "moment";
import mongoose from "mongoose";
import Stripe from 'stripe';
import authOrderModel from "../../models/authOrderModel.js";
import cardModel from "../../models/cardModel.js";
import customerOrderModel from "../../models/customerOrderModel.js";
import myShopWalletSchemaModel from "../../models/myShopWalletModel.js";
import productModel from "../../models/productModel.js";
import sellerWalletModel from "../../models/sellerWalletModel.js";
import { responseReturn } from "../../utiles/response.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // la clé depuis l'environnement.


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

/*
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

 console.table(products);

  // console.log(JSON.stringify(products))

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
*/

export const place_order = async (req, res) => {
  const {
    products,         // Tableau de groupes par vendeur : [{ sellerId, price, products }]
    price,            // Prix global hors frais de livraison
    Shipping_fees,    // Frais de livraison global
    items,            // Nombre total d’articles
    shippingInfo,
    customerId
  } = req.body;

 // console.log('product index 0 :>> ', products[0]);

  const authOrderData = [];
  const cardId = [];
  const tempDate = moment(Date.now()).format('LLL');
  let customerOrderProducts = [];

  try {
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return responseReturn(res, 400, { message: "ID utilisateur invalide." });
    }

    const userId = mongoose.Types.ObjectId.createFromHexString(customerId);

    // 🧩 Étape 1 : Construction des produits pour customerOrderModel
    for (const group of products) {
      for (const item of group.products) {
        const baseProduct = item.productInfo;
        const quantity = item.quantity;
        const selectedVariant = item.selectedVariant;

            const productToSave = {
                ...baseProduct,
                quantity,
                cardId: item._id , // 🔑 Stocker l’identifiant de panier
                item_ShippingFee: item.item_ShippingFee,
            };

        // Ajouter les infos de la variante s’il y en a
        if (selectedVariant) {
          productToSave.selectedVariant = {
            color: selectedVariant.color,
            size: selectedVariant.size,
            variantPrice: selectedVariant.variantPrice,
            variantImage: selectedVariant.variantImage,
            variantStock: selectedVariant.variantStock
          };
        }

        customerOrderProducts.push(productToSave);

        if (item._id) {
          cardId.push(item._id);
        }
      }
    }

    // 🧩 Étape 2 : Création de la commande principale client
    const order = await customerOrderModel.create({
      customerId: userId,
      products: customerOrderProducts,
      price: price + Shipping_fees,
      quantity: items,
      payment_status: 'unpaid',
      shippingInfo,
      delivery_status: 'pending',
      date: tempDate
    });

    // 🧩 Étape 3 : Création des commandes spécifiques aux vendeurs (authOrderModel)
    for (const group of products) {
      const sellerId = group.sellerId;
      const sellerObjectId = mongoose.Types.ObjectId.createFromHexString(sellerId);
      const sellerPrice = group.price;
      const storeProducts = [];

      for (const item of group.products) {
        const baseProduct = item.productInfo;
        const quantity = item.quantity;
        const selectedVariant = item.selectedVariant;

        const productToSave = {
                ...baseProduct,
            quantity,
            cardId: item._id , // 🔑 Stocker l’identifiant de panier
            item_ShippingFee: item.item_ShippingFee,
        };

        if (selectedVariant) {
          productToSave.selectedVariant = {
            color: selectedVariant.color,
            size: selectedVariant.size,
            variantPrice: selectedVariant.variantPrice,
            variantImage: selectedVariant.variantImage,
            variantStock: selectedVariant.variantStock
          };
        }

        storeProducts.push(productToSave);
      }

      authOrderData.push({
        orderId: order._id,
        sellerId: sellerObjectId,
        products: storeProducts,
        price: sellerPrice,
        payment_status: 'unpaid',
        shippingInfo,
        delivery_status: 'pending',
        date: tempDate
      });
    }

    // 🧩 Étape 4 : Insertion des commandes vendeurs
    await authOrderModel.insertMany(authOrderData);

    // 🧩 Étape 5 : Suppression des produits du panier
    for (const id of cardId) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await cardModel.findByIdAndDelete(id);
      }
    }

    // 🧩 Étape 6 : Vérification du paiement après 5 secondes
    setTimeout(async () => {
      const paymentResult = await payment_check(order._id);
      if (!paymentResult.success) {
        console.log(paymentResult.message);
      }
    }, 5000);

    return responseReturn(res, 201, {
      message: "Commande passée avec succès.",
      orderId: order._id
    });

  } catch (error) {
    console.error("Erreur place_order :", error);
    return responseReturn(res, 500, { message: "Erreur lors du traitement de la commande." });
  }
};

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
    //console.log('get order by id is running :>> req params :', req.params);
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

/*
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
*/

export const get_admin_orders = async (req, res) => {
    let { page, searchValue, parPage } = req.query;
    page = parseInt(page);
    parPage = parseInt(parPage);

    const skipPage = parPage * (page - 1);

    try {
        if (searchValue) {
            // Ajouter logique de recherche ici
        } else {
            const orders = await customerOrderModel.aggregate([
                {
                    $lookup: {
                        from: 'authorders',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'subOrder'
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: skipPage },
                { $limit: parPage }
            ]);

            const totalOrderResult = await customerOrderModel.aggregate([
                {
                    $lookup: {
                        from: 'authorders',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'subOrder'
                    }
                },
                { $count: 'total' }
            ]);

            const totalOrder = totalOrderResult[0]?.total || 0;

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

/*
export const updateOrderProductQuantity = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.body.productId;
    const newQuantity = req.body.newQuantity;
    const sellerId = req.body.sellerId;
    
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
 */

/*
export const updateOrderProductQuantity = async (req, res) => {
  const { orderId } = req.params;
  const { productId, newQuantity, sellerId, selectedVariant } = req.body;

  try {
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return responseReturn(res, 400, { message: "ID invalide" });
    }

    const order = await customerOrderModel.findById(orderId);
    const authOrder = await authOrderModel.findOne({ orderId, sellerId });

    if (!order || !authOrder) {
      return responseReturn(res, 404, { message: "Commande non trouvée." });
    }

    // Recherche du produit à mettre à jour (avec ou sans variante)
    const matchVariant = (p) =>
      p._id.toString() === productId &&
      (!selectedVariant ||
        (p.selectedVariant &&
          p.selectedVariant.color === selectedVariant.color &&
          p.selectedVariant.size === selectedVariant.size));

    const productIndex = order.products.findIndex(matchVariant);
    const authProductIndex = authOrder.products.findIndex(matchVariant);

    if (productIndex === -1 || authProductIndex === -1) {
      return responseReturn(res, 404, { message: "Produit non trouvé dans la commande." });
    }

    const productToUpdate = order.products[productIndex];
    const authProductToUpdate = authOrder.products[authProductIndex];

    const stock = productToUpdate.selectedVariant?.variantStock ?? productToUpdate.stock;

    if (newQuantity < 1 || newQuantity > stock) {
      return responseReturn(res, 400, {
        message: `La quantité doit être comprise entre 1 et ${stock}.`
      });
    }

    const priceUnit = productToUpdate.selectedVariant?.variantPrice ?? productToUpdate.price;
    const priceDiscounted = priceUnit - (priceUnit * (productToUpdate.discount || 0) / 100);
    const delta = newQuantity - productToUpdate.quantity;

    const updatedOrderPrice = order.price + delta * priceDiscounted;
    const updatedAuthPrice = authOrder.price + delta * priceDiscounted;

    // Mise à jour uniquement si la commande est impayée
    if (order.payment_status === 'unpaid') {
      // Mise à jour dans customerOrderModel
      order.products[productIndex].quantity = newQuantity;
      order.price = parseFloat(updatedOrderPrice).toFixed(2);
      await order.save();

      // Mise à jour dans authOrderModel
      authOrder.products[authProductIndex].quantity = newQuantity;
      authOrder.price = parseFloat(updatedAuthPrice).toFixed(2);
      await authOrder.save();
    }

    return responseReturn(res, 200, { message: "Quantité mise à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur." });
  }
};
*/

/*
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
*/
 /*
export const delete_Order = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    const sellerId = req.params.sellerId;
    const { color, size } = req.query;

    console.log('color ', color);
    console.log('size ', size);

    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return responseReturn(res, 400, { message: "ID de commande invalide." });
        }

        const order = await customerOrderModel.findById(orderId);
        const authOrder = await authOrderModel.findOne({ orderId, sellerId });

        //console.log('order ', order)
       // console.log('authOrder ', authOrder)

        if (!order || !authOrder) {
            return responseReturn(res, 404, { message: "Commande non trouvée." });
        }

        // Trouver le produit à supprimer (avec les variantes)
    
        console.log("🔍 Analyse des produits dans la commande :");
        order.products.forEach((p, index) => {
        console.log(`Produit ${index + 1}:`);
        console.log(" - productId:", p._id?.toString());
        console.log(" - color:", p.selectedVariant?.color);
        console.log(" - size:", p.selectedVariant?.size);
        });
        console.log("Critères de suppression → productId:", productId, "color:", color, "size:", size);


        const matchProduct = (p) => {
            const isSameProduct = p._id?.toString() === productId;

            const hasVariant = !!p.selectedVariant;
            const colorMatch = p.selectedVariant?.color === color;
            const sizeMatch = p.selectedVariant?.size === size;

            console.log('is SameProduct ', isSameProduct);
            console.log('hasVariant ', hasVariant);
            console.log('colorMatch ', colorMatch);
            console.log('sizeMatch ', sizeMatch);
            if (hasVariant && color && size) {
                return isSameProduct && colorMatch && sizeMatch;
            }

            // Cas produit sans variante (aucune couleur/taille fournie)
            if (!hasVariant && !color && !size) {
                return isSameProduct;
            }

            return false; // pas de correspondance
        };


       // order.products = order.products.filter(p => !matchProduct(p));

        //console.log('order products après suppression :', order.products);

        const productInOrder = order.products.filter(p => !matchProduct(p));
        const productInAuthOrder = authOrder.products.filter(p => !matchProduct(p));

      console.log('product In Order', productInOrder)
      //  console.log('product In Auth Order', productInAuthOrder)

        if (!productInOrder || !productInAuthOrder) {
            return responseReturn(res, 404, { message: "Produit non trouvé dans la commande." });
        }
        console.log('productInOrder selectedVariant variantPrice: ', productInOrder[0].selectedVariant.variantPrice)
        const totalReduction = productInOrder.quantity * productInOrder.selectedVariant.variantPrice;

        // Supprimer le produit dans customerOrderModel
        await customerOrderModel.updateOne(
            { _id: orderId },
            {
                $pull: {
                    products: {
                        productId,
                        'selectedVariant.color': color,
                        'selectedVariant.size': size
                    }
                },
                $inc: { price: -totalReduction }
            }
        );

        // Supprimer le produit dans authOrderModel
        await authOrderModel.updateOne(
            { orderId, sellerId },
            {
                $pull: {
                    products: {
                        productId,
                        'selectedVariant.color': color,
                        'selectedVariant.size': size
                    }
                },
                $inc: { price: -totalReduction }
            }
        );

        // Rechargement des commandes mises à jour
        const updatedOrder = await customerOrderModel.findById(orderId);
        const updatedAuthOrder = await authOrderModel.findOne({ orderId, sellerId });

        console.log('Produits AVANT suppression:', order.products.length);
        console.log('Produits APRÈS suppression:', updatedOrder.products.length);


        let orderDeleted = false;
        let authOrderDeleted = false;

        if (!updatedOrder?.products.length) {
            await customerOrderModel.findByIdAndDelete(orderId);
            orderDeleted = true;
        }

        if (!updatedAuthOrder?.products.length) {
            await authOrderModel.deleteOne({ orderId, sellerId });
            authOrderDeleted = true;
        }

        return responseReturn(res, 200, {
            message: orderDeleted
                ? "Produit supprimé. La commande a été supprimée car elle ne contenait plus aucun produit."
                : "Produit supprimé avec succès.",
            orderDeleted,
            authOrderDeleted,
            productId,
            color,
            size
        });

    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error.message);
        return responseReturn(res, 500, { message: "Erreur serveur." });
    }
};
*/

/*
export const delete_Order = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    const sellerId = req.params.sellerId;
    const { color, size } = req.query;
    const selectedVariant = req.body.selectedVariant;

    console.log('selected body:', req.body);

    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return responseReturn(res, 400, { message: "ID de commande invalide." });
        }

        const order = await customerOrderModel.findById(orderId);
        const authOrder = await authOrderModel.findOne({ orderId, sellerId });

        if (!order || !authOrder) {
            return responseReturn(res, 404, { message: "Commande non trouvée." });
        }

        // 🔍 Trouver le produit à supprimer dans la commande globale

        const productToDelete = order.products.find((p) => {
            return (
                p.selectedVariant?.color === color &&
                p.selectedVariant?.size === size &&
                p._id?.toString() === productId  // Si tu le stockes bien
            );
            });

            if (!productToDelete) {
            return responseReturn(res, 404, { message: "Produit à supprimer non trouvé." });
            }

            // 💰 Calcul du prix à déduire
        const quantity = productToDelete.quantity || 1;
        const price = productToDelete.selectedVariant?.variantPrice || 0;
        const totalReduction = quantity * price;

            // Suppression ciblée dans customerOrder
            await customerOrderModel.updateOne(
            { _id: orderId },
            {
                $pull: {
                products: {
                    _id: productToDelete._id // ✅ Cibler uniquement cette variante
                }
                },
                $inc: { price: -totalReduction }
            }
            );

            // Pareil dans authOrder
            await authOrderModel.updateOne(
            { orderId, sellerId },
            {
                $pull: {
                products: {
                    _id: productToDelete._id // ✅ Bien ciblé
                }
                },
                $inc: { price: -totalReduction }
            }
            );


        // Vérifier si les commandes sont désormais vides
        const updatedOrder = await customerOrderModel.findById(orderId);
        const updatedAuthOrder = await authOrderModel.findOne({ orderId, sellerId });

        let orderDeleted = false;
        let authOrderDeleted = false;

        if (!updatedOrder?.products.length) {
            await customerOrderModel.findByIdAndDelete(orderId);
            orderDeleted = true;
        }

        if (!updatedAuthOrder?.products.length) {
            await authOrderModel.deleteOne({ orderId, sellerId });
            authOrderDeleted = true;
        }

        return responseReturn(res, 200, {
            message: orderDeleted
                ? "Produit supprimé. La commande a été supprimée car elle ne contenait plus aucun produit."
                : "Produit supprimé avec succès.",
            orderDeleted,
            authOrderDeleted,
            productId,
            color,
            size
        });

    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error.message);
        return responseReturn(res, 500, { message: "Erreur serveur." });
    }
};
*/


export const delete_Order = async (req, res) => {
  const orderId = req.params.orderId;
  const sellerId = req.params.sellerId;
  const cardId = req.params.cardId;
  console.log('card Id', cardId);

  const commission = 0;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(cardId)) {
      return responseReturn(res, 400, { message: "ID invalide." });
    }

    const order = await customerOrderModel.findById(orderId);
    const authOrder = await authOrderModel.findOne({ orderId, sellerId });

    if (!order || !authOrder) {
      return responseReturn(res, 404, { message: "Commande non trouvée." });
    }

    // Trouver l'item dans customerOrder
    const productToDelete = order.products.find((p) => p.cardId?.toString() === cardId);

    if (!productToDelete) {
      return responseReturn(res, 404, { message: "Produit à supprimer non trouvé dans la commande." });
    }

    const quantity = productToDelete.quantity || 1;
    const price = productToDelete.selectedVariant?.variantPrice || productToDelete.price || 0;

      const priceAfterDiscount = price * (1 - (productToDelete.discount || 0) / 100);
      const finalPrice = priceAfterDiscount * (1 - commission / 100);

    const totalReduction = quantity*finalPrice + productToDelete.item_ShippingFee;

    // Suppression dans customerOrder
    await customerOrderModel.updateOne(
      { _id: orderId },
      {
        $pull: { products: { cardId } },
        $inc: { price: -totalReduction }
      }
    );

    // Suppression dans authOrder
    await authOrderModel.updateOne(
      { orderId, sellerId },
      {
        $pull: { products: { cardId } },
        $inc: { price: -totalReduction }
      }
    );

    // Vérification après suppression
    const updatedOrder = await customerOrderModel.findById(orderId);
    const updatedAuthOrder = await authOrderModel.findOne({ orderId, sellerId });

    let orderDeleted = false;
    let authOrderDeleted = false;

    if (!updatedOrder?.products.length) {
      await customerOrderModel.findByIdAndDelete(orderId);
      orderDeleted = true;
    }

    if (!updatedAuthOrder?.products.length) {
      await authOrderModel.deleteOne({ orderId, sellerId });
      authOrderDeleted = true;
    }

    return responseReturn(res, 200, {
      message: orderDeleted
        ? "Produit supprimé. La commande a été supprimée car elle ne contenait plus aucun produit."
        : "Produit supprimé avec succès.",
      orderDeleted,
      authOrderDeleted,
      cardId,
      updatedCustomerOrderPrice: updatedOrder.price,
    });

  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error.message);
    return responseReturn(res, 500, { message: "Erreur serveur." });
  }
};

/*
export const updateOrderProductQuantity = async (req, res) => {
  try {
    const { orderId, sellerId, cardId } = req.params;
    const { newQuantity, state } = req.body;
     console.log('order id ', orderId)
     console.log('seller id ', sellerId)
     console.log('card id ', cardId)
     console.log('new quantity ', newQuantity)
     console.log('state ', state)

    if (!newQuantity || newQuantity < 1) {
      return res.status(400).json({ message: "Quantité invalide." });
    }

    // Mise à jour dans customerOrders
    const customerOrder = await customerOrderModel.findById(orderId);
    if (!customerOrder) return res.status(404).json({ message: "Commande client introuvable." });

    const itemToUpdate = customerOrder.products.find((item) => item.cardId === cardId);
    if (!itemToUpdate) return res.status(404).json({ message: "Produit non trouvé dans la commande client." });

    //console.log('item to update ', itemToUpdate)

    //  Vérifier le stock réel
    let stockAvailable = itemToUpdate.stock;
    let variantImage = itemToUpdate.thumbnail;

    const selectedVariant=itemToUpdate.selectedVariant

    if (selectedVariant) {
      const variantInProduct = itemToUpdate.variants.find(v =>
        v.color === selectedVariant.color && v.size === selectedVariant.size
      );

      if (!variantInProduct) {
        return responseReturn(res, 400, { message: "Variante introuvable." });
      }

     // console.log('variant', variantInProduct);

      stockAvailable = variantInProduct.variantStock;
      //priceToUse = variantInProduct.variantPrice ?? product.price;
      variantImage = variantInProduct.variantImage ?? product.thumbnail;
    }

    if (newQuantity > stockAvailable) {
      return responseReturn(res, 400, {
        message: `Stock insuffisant. Seulement ${stockAvailable} en stock.`
      });
    }

    // Calcul du prix unitaire et des frais de livraison unitaire
    const unitPrice = itemToUpdate.price;
    const unitShippingFee = itemToUpdate.item_ShippingFee && itemToUpdate.quantity
      ? itemToUpdate.item_ShippingFee / itemToUpdate.quantity
      : 0;

    itemToUpdate.quantity = newQuantity;
    itemToUpdate.price = unitPrice * newQuantity;
    itemToUpdate.item_ShippingFee = unitShippingFee * newQuantity;

    await itemToUpdate.save()

    // Recalcul total
    customerOrder.price = customerOrder.products.reduce((acc, p) => acc + (p.price || 0), 0);
    customerOrder.Shipping_fees = customerOrder.products.reduce((acc, p) => acc + (p.item_ShippingFee || 0), 0);
    customerOrder.quantity = customerOrder.products.reduce((acc, p) => acc + (p.quantity || 0), 0);

    await customerOrder.save();

    // Mise à jour dans authOrders
    const authOrder = await authOrderModel.findOne({
      orderId: orderId,
      sellerId: sellerId,
    });

    console.log('auth order ', authOrder);

    if (!authOrder) return res.status(404).json({ message: "Commande vendeur introuvable." });

    const authItemToUpdate = authOrder.products.find((item) => item.cardId === cardId);
    if (!authItemToUpdate) return res.status(404).json({ message: "Produit non trouvé dans la commande vendeur." });

    authItemToUpdate.quantity = newQuantity;
    authItemToUpdate.price = unitPrice * newQuantity;
    authItemToUpdate.item_ShippingFee = unitShippingFee * newQuantity;

    await authItemToUpdate.save()

    // Recalcul des totaux
    authOrder.price = authOrder.products.reduce((acc, p) => acc + (p.price || 0), 0);
    authOrder.Shipping_fees = authOrder.products.reduce((acc, p) => acc + (p.item_ShippingFee || 0), 0);
    authOrder.quantity = authOrder.products.reduce((acc, p) => acc + (p.quantity || 0), 0);

    await authOrder.save();

    return res.status(200).json({
      message: "Quantité mise à jour avec succès.",
      order: customerOrder,
    });
  } catch (error) {
    console.error("Erreur updateOrderProductQuantity:", error);
    return res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la quantité." });
  }
};
*/
/*
export const updateOrderProductQuantity = async (req, res) => {
  try {
    const { orderId, sellerId, cardId } = req.params;
    const { newQuantity, state } = req.body;

    if (!newQuantity || newQuantity < 1) {
      return res.status(400).json({ message: "Quantité invalide." });
    }

    // 🟡 Récupération commande client
    const customerOrder = await customerOrderModel.findById(orderId);
    if (!customerOrder) {
      return res.status(404).json({ message: "Commande client introuvable." });
    }

    const itemToUpdate = customerOrder.products.find((item) => item.cardId === cardId);
    if (!itemToUpdate) {
      return res.status(404).json({ message: "Produit non trouvé dans la commande client." });
    }

    // 🟡 Vérification du stock
    let stockAvailable = itemToUpdate.stock;
    const selectedVariant = itemToUpdate.selectedVariant;

    if (selectedVariant) {
      const variant = itemToUpdate.variants.find(v =>
        v.color === selectedVariant.color && v.size === selectedVariant.size
      );

      if (!variant) {
        return res.status(400).json({ message: "Variante introuvable." });
      }

      stockAvailable = variant.variantStock;
    }

    if (newQuantity > stockAvailable) {
      return res.status(400).json({
        message: `Stock insuffisant. Seulement ${stockAvailable} en stock.`,
      });
    }

    // 🟡 Mise à jour des valeurs dans customerOrder
    const unitPrice = itemToUpdate.price;
    const unitShippingFee = itemToUpdate.item_ShippingFee / itemToUpdate.quantity;

    itemToUpdate.quantity = newQuantity;
    itemToUpdate.price = unitPrice * newQuantity;
    itemToUpdate.item_ShippingFee = unitShippingFee * newQuantity;

    // Recalcul global
    customerOrder.price = customerOrder.products.reduce((sum, p) => sum + (p.price || 0), 0);
    customerOrder.Shipping_fees = customerOrder.products.reduce((sum, p) => sum + (p.item_ShippingFee || 0), 0);
    customerOrder.quantity = customerOrder.products.reduce((sum, p) => sum + (p.quantity || 0), 0);

    await customerOrder.save();

    // 🟡 Récupération commande vendeur
    const authOrder = await authOrderModel.findOne({ orderId, sellerId });
    if (!authOrder) {
      return res.status(404).json({ message: "Commande vendeur introuvable." });
    }

    const authItemToUpdate = authOrder.products.find((item) => item.cardId === cardId);
    if (!authItemToUpdate) {
      return res.status(404).json({ message: "Produit non trouvé dans la commande vendeur." });
    }

    // Mise à jour dans authOrder
    authItemToUpdate.quantity = newQuantity;
    authItemToUpdate.price = unitPrice * newQuantity;
    authItemToUpdate.item_ShippingFee = unitShippingFee * newQuantity;

    // Recalcul global vendeur
    authOrder.price = authOrder.products.reduce((sum, p) => sum + (p.price || 0), 0);
    authOrder.Shipping_fees = authOrder.products.reduce((sum, p) => sum + (p.item_ShippingFee || 0), 0);
    authOrder.quantity = authOrder.products.reduce((sum, p) => sum + (p.quantity || 0), 0);

    await authOrder.save();

    return res.status(200).json({
      message: "Quantité mise à jour avec succès.",
      order: customerOrder,
    });
  } catch (error) {
    console.error("Erreur updateOrderProductQuantity:", error);
    return res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la quantité." });
  }
};
*/

export const updateOrderProductQuantity = async (req, res) => {
  try {
    const { orderId, sellerId, cardId } = req.params;
    const { newQuantity, state } = req.body;

    if (!newQuantity || newQuantity < 1) {
      return res.status(400).json({ message: "Quantité invalide." });
    }

    // 🟡 Récupération de la commande client
    const customerOrder = await customerOrderModel.findById(orderId);
    if (!customerOrder) {
      return res.status(404).json({ message: "Commande client introuvable." });
    }

    // 🔍 Recherche de l'item à mettre à jour (comparaison avec .toString())
    const itemToUpdate = customerOrder.products.find(
      (item) => item.cardId.toString() === cardId
    );

    if (!itemToUpdate) {
      return res.status(404).json({ message: "Produit non trouvé dans la commande client." });
    }

    // 🟡 Vérification du stock
    let stockAvailable = itemToUpdate.stock;
    const selectedVariant = itemToUpdate.selectedVariant;

    if (selectedVariant) {
      const variant = itemToUpdate.variants.find(
        (v) =>
          v.color === selectedVariant.color &&
          v.size === selectedVariant.size
      );

      if (!variant) {
        return res.status(400).json({ message: "Variante introuvable." });
      }

      stockAvailable = variant.variantStock;
    }

    if (newQuantity > stockAvailable) {
      return res.status(400).json({
        message: `Stock insuffisant. Seulement ${stockAvailable} en stock.`,
      });
    }

    // 🟡 Mise à jour des valeurs de l'item
    const unitPrice = itemToUpdate.price;
    const unitShippingFee = itemToUpdate.item_ShippingFee / itemToUpdate.quantity;

    itemToUpdate.quantity = newQuantity;
   // itemToUpdate.price = unitPrice * newQuantity;
    itemToUpdate.item_ShippingFee = unitShippingFee * newQuantity;

    const newQuantityPrice = itemToUpdate.price*newQuantity

    // 🔁 Recalcul des totaux dans la commande client
    customerOrder.price = customerOrder.products.reduce((sum, p) => sum + ((p.price*p.quantity )|| 0), 0);
    customerOrder.Shipping_fees = customerOrder.products.reduce((sum, p) => sum + (p.item_ShippingFee || 0), 0);
    customerOrder.quantity = customerOrder.products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    customerOrder.price = customerOrder.price + customerOrder.Shipping_fees;

    customerOrder.markModified("products");
    await customerOrder.save();

    // 🟡 Récupération de la commande vendeur
    const authOrder = await authOrderModel.findOne({ orderId, sellerId });
    if (!authOrder) {
      return res.status(404).json({ message: "Commande vendeur introuvable." });
    }

    // 🔍 Recherche de l'item à mettre à jour dans authOrder
    const authItemToUpdate = authOrder.products.find(
      (item) => item.cardId.toString() === cardId
    );

    if (!authItemToUpdate) {
      return res.status(404).json({ message: "Produit non trouvé dans la commande vendeur." });
    }

    // 🟡 Mise à jour des valeurs de l'item vendeur
    authItemToUpdate.quantity = newQuantity;
    //authItemToUpdate.price = unitPrice * newQuantity;
    authItemToUpdate.item_ShippingFee = unitShippingFee * newQuantity;

    // 🔁 Recalcul des totaux vendeur
    authOrder.price = authOrder.products.reduce((sum, p) => sum + ((p.price*p.quantity) || 0), 0);
    authOrder.Shipping_fees = authOrder.products.reduce((sum, p) => sum + (p.item_ShippingFee || 0), 0);
    authOrder.quantity = authOrder.products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    authOrder.price = authOrder.price + authOrder.Shipping_fees;

    authOrder.markModified("products");
    await authOrder.save();

    return res.status(200).json({
      message: "Quantité mise à jour avec succès.",
      order: customerOrder,
      sellerOrder: authOrder,
    });
  } catch (error) {
    console.error("Erreur updateOrderProductQuantity:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour de la quantité.",
    });
  }
};

