"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var myShopWalletSchema = new _mongoose.Schema({
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
var myShopWalletSchemaModel = (0, _mongoose.model)('myShopWallets', myShopWalletSchema);
var _default = exports["default"] = myShopWalletSchemaModel;