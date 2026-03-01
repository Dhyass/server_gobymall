

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
    type: String
  }],

  status: {
    type: String,
    enum: ['unseen', 'seen'],
    default: 'unseen'
  },

  messageType: {
    type: String,
    enum: ['text', 'image', 'product', 'order'],
    default: 'text'
  },

  // Produit simple (chat produit)
  productInfo: {
    image: { type: String },
    title: { type: String },
    price: { type: Number },
    stock: { type: Number },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' }
  },

  // 🔥 NOUVEAU : Order message
  orderInfo: {
    shopName: { type: String },
    totalPrice: { type: Number },
    orderId: { type: String },

    products: [
      {
        image: { type: String },
        title: { type: String },
        quantity: { type: Number },
        unitPrice: { type: Number },
        productId: { type: Schema.Types.ObjectId, ref: 'Product' }
      }
    ]
  }

}, { timestamps: true });

sellerCustomerMessageSchema.index({ receiverId: 1, status: 1 });

const sellerCustomerMessageModel = model('seller_customer_messages', sellerCustomerMessageSchema);
export default sellerCustomerMessageModel;

