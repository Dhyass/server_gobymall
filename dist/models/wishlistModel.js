"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var wishlistSchema = new _mongoose.Schema({
  customerId: {
    type: String,
    required: true
  },
  // Correction ici
  productId: {
    type: String,
    required: true
  },
  // Correction ici
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
  discount: {
    type: Number
  },
  rating: {
    type: Number,
    required: true
  },
  slug: {
    type: String,
    required: true
  }
}, {
  timestamps: true
}); // Ajout des timestamps

var WishlistModel = (0, _mongoose.model)('Wishlists', wishlistSchema); // Correction du nom du modèle
var _default = exports["default"] = WishlistModel;