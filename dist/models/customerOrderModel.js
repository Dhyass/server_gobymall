"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var customerOrderSchema = new _mongoose.Schema({
  customerId: {
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
  quantity: {
    type: Number,
    required: true
  },
  payment_status: {
    type: String,
    required: true
  },
  shippingInfo: {
    type: Object,
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
var customerOrderModel = (0, _mongoose.model)('customerOrders', customerOrderSchema);
var _default = exports["default"] = customerOrderModel;