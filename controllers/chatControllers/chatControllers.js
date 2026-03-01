
import adminSellerMessageModel from "../../models/chats/adminSellerMessageModel.js";
import sellerCustomerMessageModel from "../../models/chats/sellerCustomerMessageModel.js";
import sellerCustomerModel from "../../models/chats/sellerCustomerModel.js";
import customerModel from "../../models/customerModel.js";
import sellerModel from "../../models/sellerModel.js";
import { responseReturn } from "../../utiles/response.js";

export const add_customer_friend = async (req, res) => {
    //console.log(' add_customer_friend chat running');
    //console.log(req.body);
    const { customerId, sellerId } = req.body;

    try {
                    // 🔥 Compter non lus PAR VENDEUR (toujours)
            const unreadPerSeller = await sellerCustomerMessageModel.aggregate([
                {
                    $match: {
                        receiverId: customerId,
                        status: 'unseen'
                    }
                },
                {
                    $group: {
                        _id: "$senderId",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalCustommerUnread = await sellerCustomerMessageModel.countDocuments({
                receiverId: customerId,
                status: 'unseen'
            });

        if (sellerId !== '') {
           // console.log('sellerId is not empty', sellerId);
            const seller = await sellerModel.findById(sellerId);
          // console.log('seller ', seller);
            const customer = await customerModel.findById(customerId);
          //  console.log('customer ', customer);

            // find 
            const checkSeller = await sellerCustomerModel.findOne({
                $and: [
                    { myId : {
                            $eq: customerId
                        }
                    }, 
                    {
                        myFriends:{
                            $elemMatch: {
                                fdId: sellerId
                            }
                        }
                    }
                ]
            })
            if (!checkSeller) {
               await sellerCustomerModel.updateOne(
                {
                myId: customerId
                 }
                , {
                    $push : {
                        myFriends : {
                            fdId : sellerId,
                            fdName : seller.shopInfo.shopName,
                            fdImage : seller.image
                        }
                    }
                }
            )
            }

            const checkCustomer = await sellerCustomerModel.findOne({
                $and: [
                    { myId : {
                            $eq: sellerId
                        }
                    }, 
                    {
                        myFriends:{
                            $elemMatch: {
                                fdId: customerId
                            }
                        }
                    }
                ]
            })
            if (!checkCustomer) {
                await sellerCustomerModel.updateOne(
                    {
                    myId: sellerId
                },
                {
                    $push : {
                        myFriends : {
                            fdId : customerId,
                            fdName : customer.name,
                            fdImage : ''
                        }
                    }
                }
                )
            }
            
            
            const messages = await sellerCustomerMessageModel.find({
                $or: [
                    {
                        $and: [{
                            receiverId: { $eq: sellerId }
                        }, {
                            senderId: {
                                $eq: customerId
                            }
                        }]
                    },
                    {
                        $and: [{
                            receiverId: { $eq: customerId }
                        }, {
                            senderId: {
                                $eq: sellerId
                            }
                        }]
                    }
                ]
            }).sort({ createdAt: 1 }) // 🔥 IMPORTANT


             const currentFriend = MyFriends.myFriends.find(friend => friend.fdId === sellerId)
            
            await sellerCustomerMessageModel.updateMany(
                {
                    senderId: sellerId,
                    receiverId: customerId,
                    status: 'unseen'
                },
                {
                    $set: { status: 'seen' }
                }
            );

            const MyFriends = await sellerCustomerModel.findOne({
                myId: customerId
            })
           // console.log('currentFriend', currentFriend)
            return responseReturn(res, 201, {
                myFriends : MyFriends.myFriends,
                currentFriend,
                messages,
                unreadPerSeller, 
                totalCustommerUnread
            });
        }else{
            const MyFriends = await sellerCustomerModel.findOne({myId: customerId})
           // console.log(' MyFriends', MyFriends)
            return responseReturn(res, 200, { myFriends : MyFriends.myFriends, unreadPerSeller, totalCustommerUnread});
        }
    } catch (error) {
        console.log("Error in addFriend function in sellerCustomerModel.js")
        return res.status(500).send({ message: "Internal Server Error" })
        
    }

}

export const customer_message_to_seller = async (req, res) => {
  const {
    customerId,
    sellerId,
    message,
    senderName,
    images = [],
    messageType = 'text',
    productInfo = null
  } = req.body;
//console.log('req body', req.body)
  try {
    // 1. Enregistrement du message
    const myMessage = new sellerCustomerMessageModel({
      senderName: senderName,
      senderId: customerId,
      receiverId: sellerId,
      message,
      images,
      messageType,
      productInfo
    });
    await myMessage.save();

    // 2. Création de la relation amis si elle n'existe pas encore

    // Côté client
    let clientData = await sellerCustomerModel.findOne({ myId: customerId });
    if (!clientData) {
      clientData = await sellerCustomerModel.create({
        myId: customerId,
        myFriends: [{ fdId: sellerId }]
      });
    } else {
      let exists = clientData.myFriends.find(f => f.fdId === sellerId);
      if (!exists) {
        clientData.myFriends.unshift({ fdId: sellerId });
      } else {
        const index = clientData.myFriends.findIndex(f => f.fdId === sellerId);
        for (let i = index; i > 0; i--) {
          const temp = clientData.myFriends[i];
          clientData.myFriends[i] = clientData.myFriends[i - 1];
          clientData.myFriends[i - 1] = temp;
        }
      }
      await clientData.save();
    }

    // Côté vendeur
    let sellerData = await sellerCustomerModel.findOne({ myId: sellerId });
    if (!sellerData) {
      sellerData = await sellerCustomerModel.create({
        myId: sellerId,
        myFriends: [{ fdId: customerId }]
      });
    } else {
      let exists = sellerData.myFriends.find(f => f.fdId === customerId);
      if (!exists) {
        sellerData.myFriends.unshift({ fdId: customerId });
      } else {
        const index = sellerData.myFriends.findIndex(f => f.fdId === customerId);
        for (let i = index; i > 0; i--) {
          const temp = sellerData.myFriends[i];
          sellerData.myFriends[i] = sellerData.myFriends[i - 1];
          sellerData.myFriends[i - 1] = temp;
        }
      }
      await sellerData.save();
    }

    return responseReturn(res, 200, { message: 'Message envoyé avec succès' }, myMessage);

  } catch (error) {
    console.error("Erreur dans customer_message_to_seller:", error);
    return responseReturn(res, 500, { message: "Erreur interne du serveur" });
  }
};


export const sendOrderMessage = async (req, res) => {
    //console.log("request", req.body)
  try {
    const {
      senderName,
      senderId,
      receiverId,
      shopName,
      orderId,
      totalPrice,
      products
    } = req.body;

    const message = await sellerCustomerMessageModel.create({
      senderName,
      senderId,
      receiverId,
      messageType: 'order',
      message: `Commande #${orderId}`,
      orderInfo: {
        shopName,
        totalPrice: parseFloat(totalPrice, 2),
        orderId,
        products
      }
    });
    await message.save();

    const sellerId = receiverId
    const customerId = senderId

    // 2. Création de la relation amis si elle n'existe pas encore

    // Côté client
    let clientData = await sellerCustomerModel.findOne({ myId: customerId });
    if (!clientData) {
      clientData = await sellerCustomerModel.create({
        myId: customerId,
        myFriends: [{ fdId: sellerId }]
      });
    } else {
      let exists = clientData.myFriends.find(f => f.fdId === sellerId);
      if (!exists) {
        clientData.myFriends.unshift({ fdId: sellerId });
      } else {
        const index = clientData.myFriends.findIndex(f => f.fdId === sellerId);
        for (let i = index; i > 0; i--) {
          const temp = clientData.myFriends[i];
          clientData.myFriends[i] = clientData.myFriends[i - 1];
          clientData.myFriends[i - 1] = temp;
        }
      }
      await clientData.save();
    }

    // Côté vendeur
    let sellerData = await sellerCustomerModel.findOne({ myId: sellerId });
    if (!sellerData) {
      sellerData = await sellerCustomerModel.create({
        myId: sellerId,
        myFriends: [{ fdId: customerId }]
      });
    } else {
      let exists = sellerData.myFriends.find(f => f.fdId === customerId);
      if (!exists) {
        sellerData.myFriends.unshift({ fdId: customerId });
      } else {
        const index = sellerData.myFriends.findIndex(f => f.fdId === customerId);
        for (let i = index; i > 0; i--) {
          const temp = sellerData.myFriends[i];
          sellerData.myFriends[i] = sellerData.myFriends[i - 1];
          sellerData.myFriends[i - 1] = temp;
        }
      }
      await sellerData.save();
    }

    return res.status(201).json({
      success: true,
      message
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du message commande"
    });
  }
};

/*
export const customer_message_to_seller = async (req, res) => {
   // console.log('req .body:', req.body);
   const {customerId,sellerId,message,name} = req.body;
   try {
    const myMessage = new sellerCustomerMessageModel({
        senderName:name,
        senderId:customerId,
        receiverId:sellerId,
        message:message,
    })
    await myMessage.save();

    const data = await sellerCustomerModel.findOne({myId:customerId});
    let myFriends = data.myFriends;
    let friendIndex = myFriends.findIndex(friend => friend.fdId === sellerId);

    while (friendIndex>0) {
        let friend = myFriends[friendIndex];
        myFriends[friendIndex] = myFriends[friendIndex-1];
        myFriends[friendIndex-1] = friend;
        friendIndex--;
    }

    await sellerCustomerModel.updateOne({myId:customerId}, {myFriends:myFriends});
    const data1 = await sellerCustomerModel.findOne({myId:sellerId});
    let myFriends1 = data1.myFriends;
    let friendIndex1 = myFriends1.findIndex(friend => friend.fdId === customerId);
    while (friendIndex1>0) {
        let friend = myFriends1[friendIndex1];
        myFriends1[friendIndex1] = myFriends1[friendIndex1-1];
        myFriends1[friendIndex1-1] = friend;
        friendIndex1--;
    }
    await sellerCustomerModel.updateOne({myId:sellerId}, {myFriends:myFriends1})
    //console.log( 'my Message saved', myMessage);
    //console.log('my message saved', myMessage.receiverId);
    
    return responseReturn(res, 200, {message:"Message sent successfully"}, myMessage);
   } catch (error) {
    console.error("Error in send_message_to_seller function:", error);
   // return res.status(500).send({ message: "Internal Server Error" });
    return responseReturn( res, 500, {message:"Internal Server Error"});
   }
}

*/

export const getCustomers = async (req, res) => {
    //console.log('req params:', req.params);
    const {sellerId } = req.params;
    try {
        const data = await sellerCustomerModel.findOne({myId:sellerId});
       // console.log('data:', data);
        const myCustomers = data.myFriends;
        //const myFriends = data.myFriends;
        //console.log('myFriends:', myCustomers);

         /// Compter non lus PAR CLIENT
     
    
        const unreadPerCustomer = await sellerCustomerMessageModel.aggregate([
            {
                $match: {
                    receiverId: sellerId,
                    status: 'unseen'
                }
            },
            {
                $group: {
                    _id: "$senderId",
                    count: { $sum: 1 }
                }
            }
        ]);

        ///Compter le total non lus pour un vendeur
        const totalUnread = await sellerCustomerMessageModel.countDocuments({
            receiverId: sellerId,
            status: 'unseen'
        });

        responseReturn (res, 200, {message:"Customers fetched successfully", customers:myCustomers, totalUnread, unreadPerCustomer});
    } catch (error) {
        console.error("Error in getCustomers function:", error);
        return responseReturn( res, 500, {message:"Internal Server Error"});
    }
}

export const get_customer_messages = async (req, res) => {
    //console.log('req params:', req.params.customerId);
    //console.log('req.id :', req.id);
    const {customerId} = req.params;
   // console.log( 'customerId:', customerId);
    const id = req.id;
   // console.log('sellerId:', id);
    try {
        const messages = await sellerCustomerMessageModel.find({
            $or: [
                {
                    $and: [{
                        receiverId: { $eq: customerId }
                    }, {
                        senderId: {
                            $eq: id
                        }
                    }]
                },
                {
                    $and: [{
                        receiverId: { $eq: id }
                    }, {
                        senderId: {
                            $eq : customerId
                        }
                    }]
                }
            ]
        }).sort({ createdAt: 1 }) // 🔥 IMPORTANT

         // 🔥 IMPORTANT → Marquer comme seen
        await sellerCustomerMessageModel.updateMany(
            {
                senderId: customerId,
                receiverId: id,
                status: 'unseen'
            },
            {
                $set: { status: 'seen' }
            }
        );
    
        const currentCustomer = await customerModel.findById(customerId);

      // console.log(' currentCustomer:', currentCustomer);

       return responseReturn (res, 200, { messages, currentCustomer });
    } catch (error) {
        console.error("Error in get_customer_messages function:", error);
        return responseReturn( res, 500, {message:"Internal Server Error"});
    }
}

/*
export const seller_message_to_customer = async (req, res) => {
    // console.log('req .body:', req.body);
    const {customerId,sellerId,message,name} = req.body;
    try {
     const myMessage = new sellerCustomerMessageModel({
         senderName:name,
         senderId:sellerId,
         receiverId:customerId,
         message:message,
     })
     await myMessage.save();
 
     const data = await sellerCustomerModel.findOne({myId:sellerId});
     let myFriends = data.myFriends;
     let friendIndex = myFriends.findIndex(friend => friend.fdId === customerId);
 
     while (friendIndex>0) {
         let friend = myFriends[friendIndex];
         myFriends[friendIndex] = myFriends[friendIndex-1];
         myFriends[friendIndex-1] = friend;
         friendIndex--;
     }
 
     await sellerCustomerModel.updateOne({myId:sellerId}, {myFriends:myFriends});
     const data1 = await sellerCustomerModel.findOne({myId:customerId});
     let myFriends1 = data1.myFriends;
     let friendIndex1 = myFriends1.findIndex(friend => friend.fdId === sellerId);
     while (friendIndex1>0) {
         let friend = myFriends1[friendIndex1];
         myFriends1[friendIndex1] = myFriends1[friendIndex1-1];
         myFriends1[friendIndex1-1] = friend;
         friendIndex1--;
     }
     await sellerCustomerModel.updateOne({myId:customerId}, {myFriends:myFriends1})
     //console.log( 'my Message saved', myMessage);
     //console.log('my message saved', myMessage.receiverId);
     
     return responseReturn(res, 200, {message:"Message sent successfully"}, myMessage);
    } catch (error) {
     console.error("Error in send_message_to_seller function:", error);
    // return res.status(500).send({ message: "Internal Server Error" });
     return responseReturn( res, 500, {message:"Internal Server Error"});
    }
 }
*/
export const seller_message_to_customer = async (req, res) => {
    const {
      customerId,
      sellerId,
      message,
      senderName,
      images = [],
      messageType = 'text',
      productInfo = null
    } = req.body;
  //console.log('req body', req.body)
    try {
      // 1. Enregistrement du message
      const myMessage = new sellerCustomerMessageModel({
        senderName: senderName,
        senderId: sellerId ,
        receiverId: customerId,
        message,
        images,
        messageType,
        productInfo
      });
      await myMessage.save();
  
      // 2. Création de la relation amis si elle n'existe pas encore
  
      // Côté client
      // clientData
      let clientData = await sellerCustomerModel.findOne({ myId: customerId });
      if (!clientData) {
        clientData = await sellerCustomerModel.create({
          myId: customerId,
          myFriends: [{ fdId: sellerId }]
        });
      } else {
        let exists = clientData.myFriends.find(f => f.fdId === sellerId);
        if (!exists) {
          clientData.myFriends.unshift({ fdId: sellerId });
        } else {
          const index = clientData.myFriends.findIndex(f => f.fdId === sellerId);
          for (let i = index; i > 0; i--) {
            const temp = clientData.myFriends[i];
            clientData.myFriends[i] = clientData.myFriends[i - 1];
            clientData.myFriends[i - 1] = temp;
          }
        }
        await clientData.save();
      }
  
      // Côté vendeur
      let sellerData = await sellerCustomerModel.findOne({ myId: sellerId });
      if (!sellerData) {
        sellerData = await sellerCustomerModel.create({
          myId: sellerId,
          myFriends: [{ fdId: customerId }]
        });
      } else {
        let exists = sellerData.myFriends.find(f => f.fdId === customerId);
        if (!exists) {
          sellerData.myFriends.unshift({ fdId: customerId });
        } else {
          const index = sellerData.myFriends.findIndex(f => f.fdId === customerId);
          for (let i = index; i > 0; i--) {
            const temp = sellerData.myFriends[i];
            sellerData.myFriends[i] = sellerData.myFriends[i - 1];
            sellerData.myFriends[i - 1] = temp;
          }
        }
        await sellerData.save();
      }
  
      return responseReturn(res, 200, { message: 'Message envoyé avec succès' }, myMessage);
  
    } catch (error) {
      console.error("Erreur dans customer_message_to_seller:", error);
      return responseReturn(res, 500, { message: "Erreur interne du serveur" });
    }
};

export const getSellers = async (req, res) => {
    try {
        const sellers = await sellerModel.find();
        //console.log(' sellers:', sellers);
        return responseReturn(res, 200, {message:"Sellers fetched successfully", sellers:sellers});
    } catch (error) {
        console.error("Error in getSellers function:", error);
        return responseReturn(res, 500, {message:"Internal Server Error"});
    }
}

export const admin_message_to_seller = async (req, res) => {
    ///console.log('req.body:', req.body);
    const { sellerId, adminId, message, name } = req.body;

    // Vérification des champs obligatoires
    if (!sellerId || !message || !name) {
        return res.status(400).json({
            error: "sellerId, adminId, message et name sont requis."
        });
    }

    try {
         
        const admin_Message = new adminSellerMessageModel({
            senderName: name,
            senderId: adminId,
            receiverId: sellerId,
            message: message,
        });
        await admin_Message.save();

       // console.log('admin_Message', admin_Message)

        return responseReturn(res, 200, { admin_Message : admin_Message });
    } catch (error) {
        console.error("Error in admin_message_to_seller function:", error);
        return responseReturn(res, 500, { message: "Internal Server Error" });
    }
};

export const seller_message_to_admin = async (req, res) => {
   // console.log('req .body:', req.body);
    const {sellerId,adminId, message,name} = req.body;
    try {
        const seller_Message = new adminSellerMessageModel({
            senderName:name,
            senderId:sellerId,
            receiverId: adminId,
            message:message,
        })
        await seller_Message.save();
       // console.log('my Message saved', admin_Message);
       //console.log('my admin_Message',admin_Message.receiverId);
        return responseReturn(res, 200, {seller_Message:seller_Message});
    } catch (error) {
        console.error("Error in seller_message_to_admin function:", error);
        return responseReturn(res, 500, {message:"Internal Server Error"});
    }
    
 }

 //get_admin_messages
 export const get_admin_messages = async (req, res) => {
    //console.log('req params:', req.params);
    //console.log('req.id :', req.id);
    const {receiverId} = req.params;
    //console.log( 'sellerId:', receiverId);
     const adminId = '';
    //console.log('adminId:', adminId);
    try {
        const messages = await adminSellerMessageModel.find({
            $or: [
                {
                    $and: [{
                        receiverId: { $eq: receiverId}
                    }, {
                        senderId: {
                            $eq: adminId
                        }
                    }]
                },
                {
                    $and: [{
                        receiverId: { $eq: adminId }
                    }, {
                        senderId: {
                            $eq : receiverId
                        }
                    }]
                }
            ]
        }).sort({ createdAt: 1 }) // 🔥 IMPORTANT
      // console.log('messages:', messages);

       let currentSeller = {}

       if (receiverId) {
        currentSeller = await sellerModel.findById(receiverId);
       }else{
        return responseReturn (res, 400, {message: 'Seller not found'})
       }
        
      //console.log(' currentSeller:', currentSeller);

     return responseReturn (res, 200, { messages, currentSeller});
    } catch (error) {
        console.error("Error in get_admin_messages function:", error);
        return responseReturn( res, 500, {message:"Internal Server Error"});
    }
    
}

//get_seller_messages
export const get_seller_messages = async (req, res) => {
    //console.log('req params:', req.params);
    //console.log('req.id :', req.id);
    const receiverId = '';
    //console.log( 'sellerId:', receiverId);
     const sellerId = req.id;
    //console.log('sellerId : ', sellerId);
    try {
        const messages = await adminSellerMessageModel.find({
            $or: [
                {
                    $and: [{
                        receiverId: { $eq: receiverId}
                    }, {
                        senderId: {
                            $eq: sellerId 
                        }
                    }]
                },
                {
                    $and: [{
                        receiverId: { $eq: sellerId  }
                    }, {
                        senderId: {
                            $eq : receiverId
                        }
                    }]
                }
            ]
        }).sort({ createdAt: 1 }) // 🔥 IMPORTANT
       //console.log('messages:', messages);
     return responseReturn (res, 200, {messages});
    } catch (error) {
        console.error("Error in get_admin_messages function:", error);
        return responseReturn( res, 500, {message:"Internal Server Error"});
    }
    
}


///////////////////////////////////////////////////////////////////////////////////////////
//// gestions des messages non lus
//////////////////////////////////////////////////////////////////////////////////////////


export const getSellerUnreadCount = async (req, res) => {
    const sellerId = req.id; // vient du middleware authSeller

    try {

        /// Compter non lus PAR CLIENT
        const unreadPerCustomer = await sellerCustomerMessageModel.aggregate([
            {
                $match: {
                    receiverId: sellerId,
                    status: 'unseen'
                }
            },
            {
                $group: {
                    _id: "$senderId",
                    count: { $sum: 1 }
                }
            }
        ]);

        ///Compter le total non lus pour un vendeur
        const totalUnread = await sellerCustomerMessageModel.countDocuments({
            receiverId: sellerId,
            status: 'unseen'
        });

        return responseReturn(res, 200, {
            totalUnread, unreadPerCustomer
        });

    } catch (error) {
        console.error(error);
        return responseReturn(res, 500, { message: "Internal Server Error" });
    }
};

export const getCustomerUnreadCount = async (req, res) => {

    const {customerId} = req.body;

    try {

         /// Compter non lus PAR CLIENT
        const unreadPerSeller = await sellerCustomerMessageModel.aggregate([
            {
                $match: {
                    receiverId: customerId,
                    status: 'unseen'
                }
            },
            {
                $group: {
                    _id: "$senderId",
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalCustommerUnread = await sellerCustomerMessageModel.countDocuments({
            receiverId: customerId,
            status: 'unseen'
        });

        return responseReturn(res, 200, { totalCustommerUnread, unreadPerSeller});

    } catch (error) {
        console.error(error);
        return responseReturn(res, 500, { message: "Internal Server Error" });
    }
};






