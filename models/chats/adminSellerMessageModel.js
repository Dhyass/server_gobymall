import { Schema, model } from 'mongoose';

const adminSellerMessageSchema = new Schema({
   senderName:{
      type : String,
      required : true 
   },
   senderId:{
    type : String,
    default : ''
    },
    receiverId:{
        type : String,
        default : ''
     },
    message:{
        type : String,
        required : true 
     },
    
     status:{
        type : String,
        default : 'unseen'
     }
 
}, { timestamps: true });

const adminSellerMessageModel = model('admin_seller_messages', adminSellerMessageSchema );
export default adminSellerMessageModel;
