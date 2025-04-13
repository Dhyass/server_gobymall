"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var sellerWalletSchema = new _mongoose.Schema({
  sellerId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
var sellerWalletModel = (0, _mongoose.model)('sellersWallets', sellerWalletSchema);
var _default = exports["default"] = sellerWalletModel;