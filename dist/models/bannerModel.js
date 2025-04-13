"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = require("mongoose");
var bannerSchema = new _mongoose.Schema({
  productId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  banner: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
var bannerModel = (0, _mongoose.model)('banners', bannerSchema);
var _default = exports["default"] = bannerModel;