"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var withdrawRequestSchema = new _mongoose.Schema({
  sellerId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    "default": 'pending'
  }
}, {
  timestamps: true
}); // Ajout des timestamps

var withdrawRequestModel = (0, _mongoose.model)('withdrawRequest', withdrawRequestSchema); // Correction du nom du modèle
var _default = exports["default"] = withdrawRequestModel;