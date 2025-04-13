"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var productSchema = new _mongoose.Schema({
  sellerId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  // Correction ici
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discount: {
    type: Number
  },
  price: {
    type: Number,
    required: true
  },
  brand: {
    type: String
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }],
  rating: {
    type: Number,
    "default": 0
  }
}, {
  timestamps: true
}); // Ajout des timestamps

productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  category: 'text'
}, {
  weights: {
    name: 5,
    description: 3,
    brand: 2,
    category: 1
  }
});
var Product = (0, _mongoose.model)('Product', productSchema); // Correction du nom du modèle
var _default = exports["default"] = Product;