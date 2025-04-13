"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var authOrderSchema = new _mongoose.Schema({
  orderId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  sellerId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  products: {
    type: Array,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  payment_status: {
    type: String,
    required: true
  },
  shippingInfo: {
    type: String,
    required: true
  },
  delivery_status: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
var authOrderModel = (0, _mongoose.model)('authOrders', authOrderSchema);
var _default = exports["default"] = authOrderModel;