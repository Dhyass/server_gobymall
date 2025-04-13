"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var customerSchema = new _mongoose.Schema({
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
  method: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
var customerModel = (0, _mongoose.model)('customers', customerSchema);
var _default = exports["default"] = customerModel;