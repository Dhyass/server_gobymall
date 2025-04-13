"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var sellerCustomerChatSchema = new _mongoose.Schema({
  myId: {
    type: String,
    required: true
  },
  myFriends: {
    type: Array,
    "default": []
  }
}, {
  timestamps: true
});
var sellerCustomerModel = (0, _mongoose.model)('seller_customer_chats', sellerCustomerChatSchema);
var _default = exports["default"] = sellerCustomerModel;