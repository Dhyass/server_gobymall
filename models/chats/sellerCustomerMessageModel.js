import { Schema, model } from 'mongoose';

const sellerCustomerMessageSchema = new Schema({
   senderName:{
      type : String,
      required : true 
   },
   senderId:{
    type : String,
    required : true 
    },
    receiverId:{
        type : String,
        required : true
     },
    message:{
        type : String,
        required : true 
     },
     receiverId:{
        type : String,
        required : true
     },
     status:{
        type : String,
        default : 'unseen'
     }
 
}, { timestamps: true });

const sellerCustomerMessageModel = model('seller_customer_messages', sellerCustomerMessageSchema  );
export default sellerCustomerMessageModel;
