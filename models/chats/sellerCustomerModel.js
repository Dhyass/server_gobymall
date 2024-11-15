import { Schema, model } from 'mongoose';

const sellerCustomerChatSchema = new Schema({
   myId:{
      type : String,
      required : true 
   },
   myFriends:{
      type : Array,
      default : []
   }

    
}, { timestamps: true });

const sellerCustomerModel = model('seller_customer_chats', sellerCustomerChatSchema );
export default sellerCustomerModel;
