"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
/*
const shopInfoSchema = new Schema({
    shopName: { type: String, default : '' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    address: { type: String, default:'' },
    telephone: { type: String, default: '' },
}, { _id: false }); // Pas besoin d'_id pour les sous-documents

const sellerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            required: true,
            default: 'seller',
        },
        status: {
            type: String,
            required: true,
            default: 'pending',
        },
        payment: {
            type: String,
            required: true,
            default: 'inactive',
        },
        method: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: process.env.IMAGE_DEFAULT,
        },
        shopInfo: {
            type: shopInfoSchema,
            required: true,
        },
    },
    { timestamps: true }
);

// Index textuel pour la recherche
sellerSchema.index(
    {
        name: 'text',
        email: 'text',
        'shopInfo.shopName': 'text',
        'shopInfo.country': 'text',
        'shopInfo.city': 'text',
        'shopInfo.address': 'text',
    },
    {
        weights: {
            name: 5,
            email: 4,
            'shopInfo.shopName': 5,
            'shopInfo.country': 3,
            'shopInfo.city': 3,
            'shopInfo.address': 3,
        },
    }
);

const sellerModel = model('sellers', sellerSchema);
export default sellerModel;
*/

var sellerSchema = new _mongoose.Schema({
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
    "default": 'seller'
  },
  status: {
    type: String,
    required: true,
    "default": 'pending'
  },
  payment: {
    type: String,
    required: true,
    "default": 'inactive'
  },
  method: {
    type: String,
    required: true
  },
  image: {
    type: String,
    "default": process.env.IMAGE_DEFAULT
  },
  shopInfo: {
    type: Object,
    "default": {}
  }
}, {
  timestamps: true
});
sellerSchema.index({
  name: 'text',
  email: 'text',
  shopInfo: {
    shopName: 'text',
    country: 'text',
    city: 'text'
  }
}, {
  weights: {
    name: 5,
    email: 4,
    shopInfo: {
      shopName: 5,
      country: 4,
      city: 4
    }
  }
});
var sellerModel = (0, _mongoose.model)('sellers', sellerSchema);
var _default = exports["default"] = sellerModel;