"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var adminSchema = new _mongoose.Schema({
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
    "default": 'admin'
  },
  image: {
    type: String,
    "default": process.env.ADMIN_DEFAULT_IMAG
  }
}, {
  timestamps: true
});
var adminModel = (0, _mongoose.model)('admins', adminSchema);
var _default = exports["default"] = adminModel;