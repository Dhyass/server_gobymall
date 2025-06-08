import mongoose from "mongoose";
import authOrderModel from "../../models/authOrderModel.js";
import adminSellerMessageModel from "../../models/chats/adminSellerMessageModel.js";
import sellerCustomerMessageModel from "../../models/chats/sellerCustomerMessageModel.js";
import myShopWalletModel from "../../models/myShopWalletModel.js";
import productModel from "../../models/productModel.js";
import sellerModel from "../../models/sellerModel.js";
import sellerWalletModel from "../../models/sellerWalletModel.js";
import { responseReturn } from "../../utiles/response.js";

export const get_seller_dashboard_data = async (req, res) => {
    const { id } = req;
   // console.log('req body ', req.id)
   try {
       const totalSales = await sellerWalletModel.aggregate([
        {
            $match:{
                sellerId:{
                    $eq:id
                }
            }
        },
        {
            $group:{
                _id:null,
                totalAmount:{$sum:"$amount"}
            }
        }
       ])
       // Conversion de l'ID en ObjectId
        const sellerObjectId = mongoose.Types.ObjectId.createFromHexString(id)
      
       const totalOrders = await authOrderModel.find({
        sellerId: sellerObjectId
       }).countDocuments()

       const totalProducts = await productModel.find({
        sellerId: sellerObjectId
       }).countDocuments()

       const totalPendingOrders = await authOrderModel.find({
         $and : [
              { 
                sellerId: {
                    $eq : sellerObjectId
                }
             },  
             {
                delivery_status: {
                    $eq: "pending"
             }
            }
         ]
       }).countDocuments()

       const messages = await sellerCustomerMessageModel.find({
        $or:[
           {
                senderId:{
                    $eq:id
                }
            },
            {
                receiverId: {
                    $eq: id
                }
            }
        ]
       }).limit(3)

       const recentOrders = await authOrderModel.find({
        sellerId: sellerObjectId
       }).sort({ createdAt: -1 }).limit(5)
/*
       console.log('totalSales', totalSales)
       console.log('totalOrders', totalOrders)
       console.log('totalProducts', totalProducts)
       console.log('totalPendingOrders', totalPendingOrders)
       console.log('messages', messages)
       console.log('recentOrders', recentOrders)*/

       responseReturn(res, 200, {
        totalSales : totalSales.length >0 ? totalSales[0].totalAmount :0,
        totalOrders,
        totalProducts,
        totalPendingOrders,
        recentMessages : messages,
        recentOrders 
       });
    
   } catch (error) {
    console.log('getting seller data error', error.message)
    responseReturn(res, 500, {message : 'erreur interne du serveur'})
   }
}

/*
export const get_admin_dashboard_data = async(req, res)=>{
    const { id } = req;
   // console.log('req body ', req.id)
   try {
    const totalSales = await myShopWalletModel.aggregate([
        {
            $group:{
                _id:null,
                totalAmount:{$sum:"$amount"}
            }
        }
       ])

       const totalOrders = await authOrderModel.find({}).countDocuments()

       const totalProducts = await productModel.find({}).countDocuments()

       const totalSellers = await sellerModel.find({}).countDocuments() 

       const messages = await adminSellerMessageModel.find({
        $or:[
       
            {
                receiverId: {
                    $eq: ""
                }
            }
        ]
       }).limit(3)

       const recentOrders = await authOrderModel.find({}).limit(5)

      // console.log('totalSales ', totalSales)
      // console.log('totalOrders ', totalOrders)
       ///console.log('totalProducts ', totalProducts)
       //console.log('totalSellers ', totalSellers)
       //console.log('messages ', messages)
      // console.log('recentOrders ', recentOrders)

       responseReturn(res, 200, {
        totalSales : totalSales.length >0 ? totalSales[0].totalAmount :0,
        totalOrders,
        totalProducts,
        totalSellers,
        recentMessages : messages,
        recentOrders 
       });
   } catch (error) {
    console.log('getting admin data error', error.message)
    responseReturn(res, 500, {message : 'erreur interne du serveur'})
   }
}
*/

export const get_admin_dashboard_data = async(req, res) => {
    const { id } = req;

    try {
        const totalSales = await myShopWalletModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totalOrders = await authOrderModel.countDocuments();
        const totalProducts = await productModel.countDocuments();
        const totalSellers = await sellerModel.countDocuments();

        const messages = await adminSellerMessageModel.find({
            $or: [
                { receiverId: "" }
            ]
        }).sort({ createdAt: -1 }).limit(3);

        const recentOrders = await authOrderModel.find({})
            .sort({ createdAt: -1 })
            .limit(5);

        responseReturn(res, 200, {
            totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
            totalOrders,
            totalProducts,
            totalSellers,
            recentMessages: messages,
            recentOrders
        });
    } catch (error) {
        console.log('getting admin data error', error.message);
        responseReturn(res, 500, { message: 'erreur interne du serveur' });
    }
}
