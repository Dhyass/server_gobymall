import { Schema, model } from "mongoose";

const sellerSchema = new Schema(
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },

  role: { type: String, default: "seller" },
  status: { type: String, default: "pending" },

  image: { type: String, default: process.env.IMAGE_DEFAULT },
  otp: { type: String, default: "none" },

  shopInfo: { type: Object, default: {} },

  /** 🔐 SNAPSHOT ABONNEMENT ACTIF */
  subscription: {
    plan: { type: String, enum: ["BASIC", "PRO", "BUSINESS"], default: "BASIC" },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: false },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "subscriptions" },
  },

  /** 🎯 FEATURES ACTIFS */
  features: {
    maxProducts: { type: Number, default: 3 },
    priorityVisibility: { type: Boolean, default: false },
    verifiedBadge: { type: Boolean, default: false },
    advancedStats: { type: Boolean, default: false },
    promotionAccess: { type: Boolean, default: false },
  },

  /** 💰 COMMISSION ACTUELLE (déduite du plan) */
  commission: {
    type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    value: { type: Number, default: 8 },
  },
},
{ timestamps: true }
);
sellerSchema.index(
    {
        name: 'text',
        email: 'text',
        shopInfo : {
            shopName : 'text',
            country : 'text',
            city : 'text',
        }
       
    },
    {
        weights: {
            name: 5,
            email: 4,
            shopInfo : {
                shopName : 5,
                country : 4,
                city : 4,
            }
        }
    }
);

const sellerModel = model('sellers', sellerSchema);
export default sellerModel;



/*
import { Schema, model } from 'mongoose';

const sellerSchema = new Schema({
    name: { 
        type: String, 
        required: true
     },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true, 
        select: false 
    },
    role: { 
        type: String, 
        required: true, 
        default: 'seller' 
    },
    status: { 
        type: String, 
        required: true, 
        default: 'pending' 
    },
    payment: { 
        type: String, 
        required: true, 
        default: 'inactive' 
    },
    method: { 
        type: String, 
        required: true 
    },
    otp: { 
        type: String, 
        default: "none" 
    },
    image: { 
        type: String, 
        default: process.env.IMAGE_DEFAULT 
    },
    shopInfo: { 
        type: Object, 
        default:{
            
        }
    },
}, { timestamps: true });
sellerSchema.index(
    {
        name: 'text',
        email: 'text',
        shopInfo : {
            shopName : 'text',
            country : 'text',
            city : 'text',
        }
       
    },
    {
        weights: {
            name: 5,
            email: 4,
            shopInfo : {
                shopName : 5,
                country : 4,
                city : 4,
            }
        }
    }
);

const sellerModel = model('sellers', sellerSchema);
export default sellerModel;
*/