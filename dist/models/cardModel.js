"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var cardSchema = new _mongoose.Schema({
  customerId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  productId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
var cardModel = (0, _mongoose.model)('cards', cardSchema);
var _default = exports["default"] = cardModel;