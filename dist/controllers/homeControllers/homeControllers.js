"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_query_sort_products = exports.get_product = exports.get_price_range_latest_products = exports.get_home_product = exports.get_home_Category = exports.getProductReviews = exports.customer_review = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _categoryModel = _interopRequireDefault(require("../../models/categoryModel.js"));
var _productModel = _interopRequireDefault(require("../../models/productModel.js"));
var _reviewsModel = _interopRequireDefault(require("../../models/reviewsModel.js"));
var _response = require("../../utiles/response.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Format products into rows of 3
var formatProduct = function formatProduct(products) {
  var productArray = [];
  var i = 0;
  while (i < products.length) {
    var temp = [];
    var j = i;
    while (j < i + 3 && j < products.length) {
      // Ensure index does not exceed array length
      temp.push(products[j]);
      j++;
    }
    productArray.push(temp);
    i = j;
  }
  return productArray;
};
var get_home_Category = exports.get_home_Category = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var categories;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _categoryModel["default"].find({});
        case 3:
          categories = _context.sent;
          (0, _response.responseReturn)(res, 200, {
            categories: categories
          });
          _context.next = 11;
          break;
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Error fetching categories:", _context.t0);
          res.status(500).json({
            message: "Error fetching categories"
          });
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function get_home_Category(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var get_home_product = exports.get_home_product = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var products, allProducts, latestProducts, ratedProducts, topRatedProducts, discountProducts, topDiscountedProducts;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _productModel["default"].find({}).limit(16).sort({
            createdAt: -1
          });
        case 3:
          products = _context2.sent;
          _context2.next = 6;
          return _productModel["default"].find({}).limit(9).sort({
            createdAt: -1
          });
        case 6:
          allProducts = _context2.sent;
          latestProducts = formatProduct(allProducts); // Get top-rated products with a rating >= 9
          //const ratedProducts = await productModel.find({ rating: { $gte: 9 } }).limit(9).sort({ rating: -1 });
          _context2.next = 10;
          return _productModel["default"].find({
            rating: {
              $gte: 1
            }
          }).limit(9).sort({
            rating: -1
          });
        case 10:
          ratedProducts = _context2.sent;
          topRatedProducts = formatProduct(ratedProducts); // Get top discounted products
          //const discountProducts = await productModel.find({ discount: { $exists: true, $gt: 0 } }).limit(9).sort({ discount: -1 });
          _context2.next = 14;
          return _productModel["default"].find({}).limit(9).sort({
            discount: -1
          });
        case 14:
          discountProducts = _context2.sent;
          topDiscountedProducts = formatProduct(discountProducts); // Debug output
          // process.stdout.write("Home discountProducts: " + JSON.stringify(topDiscountedProducts) + "\n");
          // Return response
          (0, _response.responseReturn)(res, 200, {
            products: products,
            latestProducts: latestProducts,
            topRatedProducts: topRatedProducts,
            topDiscountedProducts: topDiscountedProducts
          });
          _context2.next = 23;
          break;
        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          console.error("Error fetching products:", _context2.t0);
          res.status(500).json({
            message: "Error fetching products"
          });
        case 23:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 19]]);
  }));
  return function get_home_product(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var get_price_range_latest_products = exports.get_price_range_latest_products = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var priceRange, products, priceRangeLatestProducts, priceRangeLatest;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          priceRange = {
            min: 0,
            max: 0
          }; // Get the latest 9 products and format them
          _context3.next = 4;
          return _productModel["default"].find({}).limit(9).sort({
            createdAt: -1
          });
        case 4:
          products = _context3.sent;
          priceRangeLatestProducts = formatProduct(products);
          _context3.next = 8;
          return _productModel["default"].find({}).sort({
            price: 1
          });
        case 8:
          priceRangeLatest = _context3.sent;
          if (priceRangeLatest.length > 0) {
            priceRange.max = priceRangeLatest[priceRangeLatest.length - 1].price;
            priceRange.min = priceRangeLatest[0].price;
          }

          //console.log("latest products:", priceRange);

          // Return response
          (0, _response.responseReturn)(res, 200, {
            priceRangeLatestProducts: priceRangeLatestProducts,
            priceRange: priceRange
          });
          _context3.next = 17;
          break;
        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          console.error("Server error:", _context3.t0);
          (0, _response.responseReturn)(res, 500, {
            message: "Error fetching products"
          });
        case 17:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 13]]);
  }));
  return function get_price_range_latest_products(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var get_query_sort_products = exports.get_query_sort_products = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var parPage, filters, products, searchValue, totalProducts, pageNumber, startIndex, paginatedProducts;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          parPage = 12;
          req.query.parPage = parPage;
          //console.log('query req ', req.query);
          _context4.prev = 2;
          // Préparez les filtres avec validation
          filters = _objectSpread(_objectSpread(_objectSpread({}, req.query.categorie && {
            category: req.query.categorie
          }), req.query.rating && !isNaN(Number(req.query.rating)) && {
            rating: {
              $gte: Number(req.query.rating.trim())
            }
          }), req.query.lowPrice && !isNaN(Number(req.query.lowPrice)) && req.query.highPrice && !isNaN(Number(req.query.highPrice)) && {
            price: {
              $gte: Number(req.query.lowPrice),
              $lte: Number(req.query.highPrice)
            }
          }); // Appliquez les filtres
          _context4.next = 6;
          return _productModel["default"].find(filters);
        case 6:
          products = _context4.sent;
          // Filtrez les produits avec searchQuery
          if (req.query.searchValue) {
            searchValue = req.query.searchValue.toUpperCase();
            products = products.filter(function (product) {
              return product.name.toUpperCase().indexOf(searchValue) > -1;
            });
          }

          // Appliquez le tri basé sur sortPrice
          if (req.query.sortPrice) {
            if (req.query.sortPrice === 'low-to-high') {
              products = products.sort(function (a, b) {
                return a.price - b.price;
              });
            } else if (req.query.sortPrice === 'high-to-low') {
              products = products.sort(function (a, b) {
                return b.price - a.price;
              });
            }
          } else {
            // Par défaut, triez par date de création décroissante
            products = products.sort(function (a, b) {
              return b.createdAt - a.createdAt;
            });
          }

          // Appliquez la pagination
          totalProducts = products.length;
          pageNumber = Number(req.query.pageNumber) || 1;
          startIndex = (pageNumber - 1) * parPage;
          paginatedProducts = products.slice(startIndex, startIndex + parPage); // Retournez les produits paginés et le total des produits
          (0, _response.responseReturn)(res, 200, {
            products: paginatedProducts,
            totalProducts: totalProducts,
            parPage: parPage
          });
          _context4.next = 19;
          break;
        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](2);
          //console.error("Error fetching products:", error);
          (0, _response.responseReturn)(res, 500, {
            message: "Erreur lors de la récupération des produits"
          });
        case 19:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[2, 16]]);
  }));
  return function get_query_sort_products(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var get_product = exports.get_product = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var productId, productIdObjectId, product, relatedProducts, moreProducts;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          productId = req.params.productId; // console.log("productId contenu brut:", productId);
          _context5.prev = 1;
          if (!(!productId || !_mongoose["default"].Types.ObjectId.isValid(productId))) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 4:
          productIdObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(productId);
          _context5.next = 7;
          return _productModel["default"].findById(productIdObjectId);
        case 7:
          product = _context5.sent;
          if (product) {
            _context5.next = 10;
            break;
          }
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Produit non trouvé"
          }));
        case 10:
          _context5.next = 12;
          return _productModel["default"].find({
            $and: [{
              _id: {
                $ne: product.id
              }
            }, {
              category: {
                $eq: product.category
              }
            }]
          }).limit(20);
        case 12:
          relatedProducts = _context5.sent;
          _context5.next = 15;
          return _productModel["default"].find({
            $and: [{
              _id: {
                $ne: product.id
              }
            }, {
              sellerId: {
                $eq: product.sellerId
              }
            }]
          }).limit(3);
        case 15:
          moreProducts = _context5.sent;
          // console.log( 'more products', moreProducts)

          //console.log("product:", product);
          (0, _response.responseReturn)(res, 200, {
            message: "Produit non trouvé",
            product: product,
            moreProducts: moreProducts,
            relatedProducts: relatedProducts
          });
          _context5.next = 23;
          break;
        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](1);
          console.error("Error fetching product:", _context5.t0);
          (0, _response.responseReturn)(res, 500, {
            message: "Erreur lors de la récupération du produit "
          });
        case 23:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 19]]);
  }));
  return function get_product(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var customer_review = exports.customer_review = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var _req$body, name, review, rating, productId, newReview, totalRating, productObjectId, reviews, i, averageRating;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          //console.log('query infos ', req.body)
          _req$body = req.body, name = _req$body.name, review = _req$body.review, rating = _req$body.rating, productId = _req$body.productId;
          _context6.prev = 1;
          newReview = new _reviewsModel["default"]({
            productId: productId,
            name: name,
            rating: parseInt(rating),
            review: review,
            date: (0, _moment["default"])(Date.now()).format('LL')
          });
          _context6.next = 5;
          return newReview.save();
        case 5:
          totalRating = 0;
          if (!(!productId || !_mongoose["default"].Types.ObjectId.isValid(productId))) {
            _context6.next = 8;
            break;
          }
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 8:
          // Conversion de l'ID en ObjectId
          productObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(productId);
          _context6.next = 11;
          return _reviewsModel["default"].find({
            productId: productId
          });
        case 11:
          reviews = _context6.sent;
          for (i = 0; i < reviews.length; i++) {
            //console.log(reviews[i].rating)
            totalRating += reviews[i].rating;
          }
          averageRating = 0;
          if (reviews.length > 0) {
            averageRating = (totalRating / reviews.length).toFixed(1);
          }
          _context6.next = 17;
          return _productModel["default"].findByIdAndUpdate(productObjectId, {
            rating: parseFloat(averageRating)
          });
        case 17:
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Avis ajouté avec succès"
          }));
        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](1);
          console.error("Error adding review:", _context6.t0);
          (0, _response.responseReturn)(res, 500, {
            message: "Erreur lors de l'ajout d 'un avis"
          });
        case 24:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 20]]);
  }));
  return function customer_review(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
/*
export const getProductReviews = async (req, res) => {
    const productId = req.params.productId;
    //const slug = req.params.slug;
    const pageNumber = req.query.pageNumber ; // Par défaut, la première page
   // console.log('page slug ', slug)
    //const limit = 5;
    const parPage = 5;
    const skip = (parseInt(pageNumber) - 1) * parPage;

    try {
        // Valider l'ID produit
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return responseReturn(res, 400, { message: "ID produit invalide" });
        }

        // Récupération des avis et calcul des statistiques
        const getRating = await reviewModel.aggregate([
            {
                $match: {
                    productId:  mongoose.Types.ObjectId.createFromHexString(productId),
                }
            },
            {
                $group: {
                    _id: "$rating", // Regrouper par valeur de "rating"
                    count: { $sum: 1 } // Compter le nombre d'avis pour chaque note
                }
            },
            
        ]);

        const rating_review = [
            { rating: 5, sum: 0 },
            { rating: 4, sum: 0 },
            { rating: 3, sum: 0 },
            { rating: 2, sum: 0 },
            { rating: 1, sum: 0 },
        ]

        for (let i = 0; i < rating_review.length; i++) {
             for (let j = 0; j <getRating.length; j++) {
                if (rating_review[i].rating===getRating[j]._id) {
                    rating_review[i].sum = getRating[j].count;
                    break
                }
             }
        }

       //console.log('console getRating', getRating);

       //console.log('console Rating reviiew', rating_review);

        const getAll_Product_Reviews = await reviewModel.find({ productId: mongoose.Types.ObjectId.createFromHexString(productId) } )
        .sort({ createdAt: -1 });
        let totalReviews = 0;
        let reviews =[];
        if (getAll_Product_Reviews.length > 0) {
            totalReviews = getAll_Product_Reviews.length;
            reviews = getAll_Product_Reviews.slice(skip, skip + parPage);
            return responseReturn(res, 200, { message: "Liste des avis", rating_review, totalReviews, reviews, parPage });
        }else{
            return responseReturn(res, 404, { message: "Aucun avis trouvé" });
        }
        
       // console.log('pageNumber ', pageNumber);
       // console.log(' reviews', reviews);

        // Retourner les résultats
       
    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        return responseReturn(res, 500, { message: "Erreur serveur", error });
    }
};
*/
/*
export const getProductReviews = async (req, res) => {
    const {productId} = req.params;
    let {pageNumber} = req.query; // Par défaut, la première page
    const parPage = 5;
    const skip = (parseInt(pageNumber) - 1) * parPage;

    try {
        // Valider l'ID produit
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return responseReturn(res, 400, { message: "ID produit invalide" });
        }

        // Récupération des statistiques de notation
        const getRating = await reviewModel.aggregate([
            {
                $match: { productId: mongoose.Types.ObjectId.createFromHexString(productId), }
            },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Initialiser le tableau des évaluations
        const rating_review = [
            { rating: 5, sum: 0 },
            { rating: 4, sum: 0 },
            { rating: 3, sum: 0 },
            { rating: 2, sum: 0 },
            { rating: 1, sum: 0 }
        ];

        // Mettre à jour les évaluations avec les résultats de l'agrégation
        getRating.forEach(({ _id, count }) => {
            const index = rating_review.findIndex(r => r.rating === _id);
            if (index !== -1) {
                rating_review[index].sum = count;
            }
        });

        // Récupération des avis avec pagination
        const totalReviews = await reviewModel.countDocuments({ productId: mongoose.Types.ObjectId.createFromHexString(productId)});
        const reviews = await reviewModel
            .find({ productId: mongoose.Types.ObjectId.createFromHexString(productId) })
            .skip(skip)
            .limit(parPage)
            .sort({ createdAt: -1 });

        // Vérifier si des avis existent
        if (totalReviews === 0) {
            return responseReturn(res, 404, { message: "Aucun avis trouvé", rating_review, totalReviews, reviews: ["Pas d'avis"], parPage });
        }else {
            // Retourner les avis avec les statistiques
            return responseReturn(res, 200, { 
                message: "Liste des avis récupérée avec succès", 
                rating_review, 
                totalReviews, 
                reviews, 
                parPage 
            });
        }

    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
        return responseReturn(res, 500, { message: "Erreur serveur", error });
    }
};

*/

var getProductReviews = exports.getProductReviews = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var productId, _req$query$pageNumber, pageNumber, parPage, skip, totalReviews, getRating, rating_review, reviews;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          productId = req.params.productId;
          _req$query$pageNumber = req.query.pageNumber, pageNumber = _req$query$pageNumber === void 0 ? 1 : _req$query$pageNumber; // Page par défaut : 1
          parPage = 5;
          skip = (parseInt(pageNumber) - 1) * parPage;
          _context7.prev = 4;
          if (_mongoose["default"].Types.ObjectId.isValid(productId)) {
            _context7.next = 7;
            break;
          }
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID produit invalide"
          }));
        case 7:
          _context7.next = 9;
          return _reviewsModel["default"].countDocuments({
            productId: _mongoose["default"].Types.ObjectId.createFromHexString(productId)
          });
        case 9:
          totalReviews = _context7.sent;
          if (!(totalReviews === 0)) {
            _context7.next = 12;
            break;
          }
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Aucun avis trouvé",
            rating_review: initializeRatingReview(),
            // Générer un tableau vide
            totalReviews: 0,
            reviews: []
          }));
        case 12:
          _context7.next = 14;
          return _reviewsModel["default"].aggregate([{
            $match: {
              productId: _mongoose["default"].Types.ObjectId.createFromHexString(productId)
            }
          }, {
            $group: {
              _id: "$rating",
              count: {
                $sum: 1
              }
            }
          }]);
        case 14:
          getRating = _context7.sent;
          // Initialiser et mettre à jour les évaluations
          rating_review = initializeRatingReview();
          getRating.forEach(function (_ref8) {
            var _id = _ref8._id,
              count = _ref8.count;
            var index = rating_review.findIndex(function (r) {
              return r.rating === _id;
            });
            if (index !== -1) {
              rating_review[index].sum = count;
            }
          });
          console.log('rating_review ', rating_review);
          // Récupérer les avis avec pagination
          _context7.next = 20;
          return _reviewsModel["default"].find({
            productId: _mongoose["default"].Types.ObjectId.createFromHexString(productId)
          }).skip(skip).limit(parPage).sort({
            createdAt: -1
          });
        case 20:
          reviews = _context7.sent;
          console.log('rewiews ', reviews);

          // Retourner les avis avec les statistiques
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Liste des avis récupérée avec succès",
            rating_review: rating_review,
            totalReviews: totalReviews,
            reviews: reviews
          }));
        case 25:
          _context7.prev = 25;
          _context7.t0 = _context7["catch"](4);
          console.error("Erreur lors de la récupération des avis :", _context7.t0);
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur serveur",
            error: _context7.t0
          }));
        case 29:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[4, 25]]);
  }));
  return function getProductReviews(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

// Fonction utilitaire pour initialiser les statistiques d'évaluation
var initializeRatingReview = function initializeRatingReview() {
  return [{
    rating: 5,
    sum: 0
  }, {
    rating: 4,
    sum: 0
  }, {
    rating: 3,
    sum: 0
  }, {
    rating: 2,
    sum: 0
  }, {
    rating: 1,
    sum: 0
  }];
};