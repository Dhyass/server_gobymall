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

/*
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
       }).sort({ createdAt: -1 }).limit(3)
*/
       const recentMessages = await sellerCustomerMessageModel.aggregate([
  
        // 1️⃣ On prend uniquement les messages NON LUS envoyés AU seller
        {
          $match: {
            receiverId: id,
            status: "unseen"
          }
        },

        // 2️⃣ On trie par date DESC pour avoir le plus récent en premier
        {
          $sort: { createdAt: -1 }
        },

        // 3️⃣ On groupe par expéditeur (chaque client = une conversation)
        {
          $group: {
            _id: "$senderId",
            lastMessage: { $first: "$$ROOT" }
          }
        },

        // 4️⃣ On retrie les conversations selon la date du dernier message
        {
          $sort: { "lastMessage.createdAt": -1 }
        },

        // 5️⃣ On limite à 3 conversations
        {
          $limit: 3
        },

        // 6️⃣ On reformate proprement
        {
          $replaceRoot: { newRoot: "$lastMessage" }
        }

      ])

       const recentOrders = await authOrderModel.find({
        sellerId: sellerObjectId
       }).sort({ createdAt: -1 }).limit(5)


       responseReturn(res, 200, {
        totalSales : totalSales.length >0 ? totalSales[0].totalAmount :0,
        totalOrders,
        totalProducts,
        totalPendingOrders,
        recentMessages,
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



export const getSellerStatistics = async (req, res) => {
  try {
    const { sellerId, year, startYear, endYear } = req.query;

   // console.log("seller id ", sellerId)

    if (!sellerId) {
      return res.status(400).json({ message: "SellerId is required" });
    }
// Conversion de l'ID en ObjectId
        
    // 🎯 Si année unique → stats mensuelles
    if (year) {
      const stats = await authOrderModel.aggregate([
        {
          $match: {
            sellerId: mongoose.Types.ObjectId.createFromHexString(sellerId),
            createdAt: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            orders: { $sum: 1 },
            revenue: { $sum: "$price" },
            sales: { $sum: { $size: "$products" } }
          }
        },
        {
          $project: {
            month: "$_id.month",
            orders: 1,
            revenue: 1,
            sales: 1,
            _id: 0
          }
        },
        { $sort: { month: 1 } }
      ]);

      // Compléter les mois manquants (Jan → Déc)
      const fullStats = Array.from({ length: 12 }, (_, i) => {
        const monthStat = stats.find(s => s.month === i + 1);
        return {
          month: i + 1,
          orders: monthStat ? monthStat.orders : 0,
          revenue: monthStat ? monthStat.revenue : 0,
          sales: monthStat ? monthStat.sales : 0
        };
      });

      // Min, Max, Moyenne
      const summary = {
        orders: {
          min: Math.min(...fullStats.map(s => s.orders)),
          max: Math.max(...fullStats.map(s => s.orders)),
          avg: fullStats.reduce((a, b) => a + b.orders, 0) / 12
        },
        revenue: {
          min: Math.min(...fullStats.map(s => s.revenue)),
          max: Math.max(...fullStats.map(s => s.revenue)),
          avg: fullStats.reduce((a, b) => a + b.revenue, 0) / 12
        },
        sales: {
          min: Math.min(...fullStats.map(s => s.sales)),
          max: Math.max(...fullStats.map(s => s.sales)),
          avg: fullStats.reduce((a, b) => a + b.sales, 0) / 12
        }
      };

      return res.json({ type: "monthly", year, stats: fullStats, summary });
    }

    // 🎯 Si intervalle d’années → stats annuelles
    if (startYear && endYear) {
      const stats = await authOrderModel.aggregate([
        {
          $match: {
            sellerId: mongoose.Types.ObjectId.createFromHexString(sellerId),
            createdAt: {
              $gte: new Date(`${startYear}-01-01`),
              $lte: new Date(`${endYear}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { year: { $year: "$createdAt" } },
            orders: { $sum: 1 },
            revenue: { $sum: "$price" },
            sales: { $sum: { $size: "$products" } }
          }
        },
        {
          $project: {
            year: "$_id.year",
            orders: 1,
            revenue: 1,
            sales: 1,
            _id: 0
          }
        },
        { $sort: { year: 1 } }
      ]);

      // Compléter les années manquantes
      const years = [];
      for (let y = parseInt(startYear); y <= parseInt(endYear); y++) {
        const yearStat = stats.find(s => s.year === y);
        years.push({
          year: y,
          orders: yearStat ? yearStat.orders : 0,
          revenue: yearStat ? yearStat.revenue : 0,
          sales: yearStat ? yearStat.sales : 0
        });
      }

      // Min, Max, Moyenne
      const summary = {
        orders: {
          min: Math.min(...years.map(s => s.orders)),
          max: Math.max(...years.map(s => s.orders)),
          avg: years.reduce((a, b) => a + b.orders, 0) / years.length
        },
        revenue: {
          min: Math.min(...years.map(s => s.revenue)),
          max: Math.max(...years.map(s => s.revenue)),
          avg: years.reduce((a, b) => a + b.revenue, 0) / years.length
        },
        sales: {
          min: Math.min(...years.map(s => s.sales)),
          max: Math.max(...years.map(s => s.sales)),
          avg: years.reduce((a, b) => a + b.sales, 0) / years.length
        }
      };

      return res.json({ type: "yearly", startYear, endYear, stats: years, summary });
    }

    return res.status(400).json({ message: "Please provide either a year or startYear & endYear" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getAdminStats = async (req, res) => {
  try {
    let { sellerId = "all", from, to } = req.query;

   // console.log(" seller iid ", sellerId);

    if (!from || !to) {
      return res.status(400).json({ message: "Please provide from and to years" });
    }

    from = parseInt(from);
    to = parseInt(to);

    const matchStage = {
      createdAt: {
        $gte: new Date(`${from}-01-01`),
        $lte: new Date(`${to}-12-31`),
      },
    };

    // Si un vendeur spécifique est sélectionné
    if (sellerId !== "all") {
      matchStage.sellerId = mongoose.Types.ObjectId.createFromHexString(sellerId);
    }

    // Déterminer si on regroupe par mois ou par année
    const groupId =
      from === to
        ? { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }
        : { year: { $year: "$createdAt" } };

    const stats = await authOrderModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
          uniqueSellers: { $addToSet: "$sellerId" },
          minRevenue: { $min: "$price" },
          maxRevenue: { $max: "$price" },
          avgRevenue: { $avg: "$price" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

   // console.log("stats ", stats);

    const formatted = stats.map((s) => ({
      year: s._id.year,
      month: s._id.month || null,
      orders: s.totalOrders,
      revenue: s.totalRevenue,
      sellers: s.uniqueSellers.length,
      min: s.minRevenue,
      max: s.maxRevenue,
      avg: s.avgRevenue,
    }));

   // console.log("formated dada ", formatted);

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error getAdminStats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

