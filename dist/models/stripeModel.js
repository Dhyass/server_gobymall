"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var stripeSchema = new _mongoose.Schema({
  sellerId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
var stripeModel = (0, _mongoose.model)('stripeAccounts', stripeSchema);
var _default = exports["default"] = stripeModel;