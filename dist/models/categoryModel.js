"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var CategorySchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
CategorySchema.index({
  name: 'text'
});
var categoryModel = (0, _mongoose.model)('categories', CategorySchema);
var _default = exports["default"] = categoryModel;