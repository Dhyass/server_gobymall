/*

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
     status:{
        type : String,
        default : 'unseen'
     }
 
}, { timestamps: true });

const sellerCustomerMessageModel = model('seller_customer_messages', sellerCustomerMessageSchema  );
export default sellerCustomerMessageModel;
*/

import { Schema, model } from 'mongoose';

const sellerCustomerMessageSchema = new Schema({
  senderName: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: null
  },
  images: [{
    type: String // URLs des images stockées (ex : Cloudinary, S3)
  }],
  status: {
    type: String,
    enum: ['unseen', 'seen'],
    default: 'unseen'
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'product'],
    default: 'text'
  },
  productInfo: {
    image: { type: String },         // image principale du produit
    title: { type: String },
    price: { type: Number },
    stock: { type: Number },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' }
  }
}, { timestamps: true });

const sellerCustomerMessageModel = model('seller_customer_messages', sellerCustomerMessageSchema);
export default sellerCustomerMessageModel;
