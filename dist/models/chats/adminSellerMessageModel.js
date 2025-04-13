"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var adminSellerMessageSchema = new _mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    "default": ''
  },
  receiverId: {
    type: String,
    "default": ''
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    "default": 'unseen'
  }
}, {
  timestamps: true
});
var adminSellerMessageModel = (0, _mongoose.model)('admin_seller_messages', adminSellerMessageSchema);
var _default = exports["default"] = adminSellerMessageModel;