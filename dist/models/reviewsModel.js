"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var reviewSchema = new _mongoose.Schema({
  productId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  review: {
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
var reviewModel = (0, _mongoose.model)('reviews', reviewSchema);
var _default = exports["default"] = reviewModel;