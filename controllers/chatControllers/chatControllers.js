
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
            })
            const MyFriends = await sellerCustomerModel.findOne({
                myId: customerId
            })
            const currentFriend = MyFriends.myFriends.find(friend => friend.fdId === sellerId)
           // console.log('currentFriend', currentFriend)
            return responseReturn(res, 201, {
                myFriends : MyFriends.myFriends,
                currentFriend,
                messages
            });
        }else{
            const MyFriends = await sellerCustomerModel.findOne({myId: customerId})
           // console.log(' MyFriends', MyFriends)
            return responseReturn(res, 200, { myFriends : MyFriends.myFriends});
        }
    } catch (error) {
        console.log("Error in addFriend function in sellerCustomerModel.js")
        return res.status(500).send({ message: "Internal Server Error" })
        
    }

}

/*
import sellerCustomerMessageModel from "../../models/chats/sellerCustomerMessageModel.js";
import sellerCustomerModel from "../../models/chats/sellerCustomerModel.js";
import customerModel from "../../models/customerModel.js";
import sellerModel from "../../models/sellerModel.js";
import { responseReturn } from "../../utiles/response.js";

export const add_customer_friend = async (req, res) => {
    const { customerId, sellerId } = req.body;

    // Validation des entrées
    if (!customerId) {
        return res.status(400).send({ message: "Customer ID is required" });
    }

    try {
        if (sellerId) {
            // Récupérer les informations du vendeur et du client
            const [seller, customer] = await Promise.all([
                sellerModel.findById(sellerId),
                customerModel.findById(customerId),
            ]);

            if (!seller) {
                return res.status(404).send({ message: "Seller not found" });
            }
            if (!customer) {
                return res.status(404).send({ message: "Customer not found" });
            }

            // Vérifier et mettre à jour les amis du client
            const checkSeller = await sellerCustomerModel.findOne({
                myId: customerId,
                myFriends: { $elemMatch: { fdId: sellerId } },
            });

            if (!checkSeller) {
                await sellerCustomerModel.updateOne(
                    { myId: customerId },
                    {
                        $push: {
                            myFriends: {
                                fdId: sellerId,
                                fdName: seller.shopInfo.shopName,
                                fdImage: seller.image,
                            },
                        },
                    },
                    { upsert: true }
                );
            }

            // Vérifier et mettre à jour les amis du vendeur
            const checkCustomer = await sellerCustomerModel.findOne({
                myId: sellerId,
                myFriends: { $elemMatch: { fdId: customerId } },
            });

            if (!checkCustomer) {
                await sellerCustomerModel.updateOne(
                    { myId: sellerId },
                    {
                        $push: {
                            myFriends: {
                                fdId: customerId,
                                fdName: customer.name,
                                fdImage: "",
                            },
                        },
                    },
                    { upsert: true }
                );
            }

            // Récupérer les messages entre le vendeur et le client
            const messages = await sellerCustomerMessageModel.find({
                $or: [
                    {
                        receiverId: sellerId,
                        senderId: customerId,
                    },
                    {
                        receiverId: customerId,
                        senderId: sellerId,
                    },
                ],
            });

            // Récupérer les amis du client
            const MyFriends = await sellerCustomerModel.findOne({ myId: customerId });
            const currentFriend = MyFriends.myFriends.find(
                (friend) => friend.fdId === sellerId
            );

            return responseReturn(res, 201, {
                myFriends: MyFriends.myFriends,
                currentFriend,
                messages,
            });
        } else {
            // Retourner la liste des amis si sellerId est vide
            const MyFriends = await sellerCustomerModel.findOne({ myId: customerId });
            return responseReturn(res, 200, { myFriends: MyFriends?.myFriends || [] });
        }
    } catch (error) {
        console.error("Error in addFriend function in sellerCustomerModel.js:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
*/

export const send_message_to_seller = async (req, res) => {
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

export const getCustomers = async (req, res) => {
    //console.log('req params:', req.params);
    const {sellerId } = req.params;
    try {
        const data = await sellerCustomerModel.findOne({myId:sellerId});
        console.log('data:', data);
        const myCustomers = data.myFriends;
        //const myFriends = data.myFriends;
        //console.log('myFriends:', myCustomers);

        responseReturn (res, 200, {message:"Customers fetched successfully", customers:myCustomers});
    } catch (error) {
        console.error("Error in getCustomers function:", error);
        return responseReturn( res, 500, {message:"Internal Server Error"});
    }
}