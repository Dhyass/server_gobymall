"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update_product_quantity = exports.get_wishlist_products = exports.get_cards = exports.get_card = exports.delete_wishlist_product = exports.delete_card_product = exports.add_to_wishlist = exports.add_to_card = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _cardModel = _interopRequireDefault(require("../../models/cardModel.js"));
var _wishlistModel = _interopRequireDefault(require("../../models/wishlistModel.js"));
var _response = require("../../utiles/response.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var add_to_card = exports.add_to_card = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, customerId, productId, quantity, customerObjectId, productObjectId, product, newCard;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, customerId = _req$body.customerId, productId = _req$body.productId, quantity = _req$body.quantity;
          _context.prev = 1;
          if (!(!customerId || !_mongoose["default"].Types.ObjectId.isValid(customerId))) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 4:
          // Conversion de l'ID en ObjectId
          customerObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(customerId);
          if (!(!productId || !_mongoose["default"].Types.ObjectId.isValid(productId))) {
            _context.next = 7;
            break;
          }
          return _context.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 7:
          productObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(productId);
          _context.next = 10;
          return _cardModel["default"].findOne({
            $and: [{
              productId: {
                $eq: productObjectId
              }
            }, {
              customerId: {
                $eq: customerObjectId
              }
            }]
          });
        case 10:
          product = _context.sent;
          if (!product) {
            _context.next = 15;
            break;
          }
          return _context.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Product already exist in your cart"
          }));
        case 15:
          newCard = new _cardModel["default"]({
            customerId: customerId,
            productId: productId,
            quantity: quantity
          });
          _context.next = 18;
          return newCard.save();
        case 18:
          return _context.abrupt("return", (0, _response.responseReturn)(res, 201, {
            message: "Product added to your cart",
            newCard: newCard
          }));
        case 19:
          _context.next = 25;
          break;
        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0.message);
          return _context.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Internal server error"
          }));
        case 25:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 21]]);
  }));
  return function add_to_card(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/*
export const get_card = async (req, res) => {
    const { id } = req.params;
   // console.log('id reçu :', id);
   const commission = 5;

    try {
        // Conversion de l'id reçu en ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        const card_products = await cardModel.aggregate([
            {
                $match: {
                    customerId: objectId, // Comparaison avec ObjectId
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products",
                }
            }
        ]);

        //console.log('Produits du panier :', card_products);
        let calculatePrice = 0;
        let card_total = 0;
        const outOfStockProduct = card_products.filter(product=>product.products[0].stock < product.quantity);
        for (let i = 0; i < outOfStockProduct.length; i++) {
            card_total += outOfStockProduct[i].quantity
        }
       // console.log('out OfStockProduct :', outOfStockProduct);
       //console.log('card _total :', card_total);

       const stockProducts = card_products.filter(product=>product.products[0].stock >= product.quantity);
       //console.log('stock Products :', stockProducts);
       for (let i = 0; i < stockProducts.length; i++) {
                const {quantity} = stockProducts[i];
                card_total += quantity;
            const {price, discount} = stockProducts[i].products[0];
            if (discount!==0) {
                calculatePrice +=(price * quantity) *(1 - (discount/100));
            } else {
                calculatePrice += price * quantity;
            }
       }
       
       //console.log('card _total :', card_total);
       //console.log('stockProducts[i].products[0] :', stockProducts[0].products[0]);
      // console.log('calculatePrice :', calculatePrice);

       let p = [];
       let unique = [... new Set(stockProducts.map(p=>p.products[0].sellerId.toString()))]

       for (let i = 0; i < unique.length; i++) {
        let price = 0;
        for (let j = 0; j < stockProducts.length; j++) {
            const tempProducts = stockProducts[j].products[0];

            if (unique[j]===tempProducts[j].products[0].sellerId.toString()) {
                let prix =0;
                if (tempProducts.discount !==0) {
                    prix = tempProducts.price * (1 - (tempProducts.discount/100));
                }else {
                    prix = tempProducts.price ;
                }
                prix = prix*(1-commission/100)
                price += prix*stockProducts[j].quantity;
                p[i] = {
                    sellerId: unique[i],
                    shopName : tempProducts.shopName,
                    price,
                    //quantity: stockProducts[i].quantity
                    products : p[i] ? [...p[i].products, 
                    {
                        _id : stockProducts[j]._id,
                        quantity : stockProducts[j].quantity,
                        productInfo : tempProducts,
                    }
                ] : [
                    {
                        _id : stockProducts[j]._id,
                        quantity : stockProducts[j].quantity,
                        productInfo : tempProducts,
                    }
                ]
                }
            }
            
            console.log('tempProdcuts :', tempProducts);
        }
        
       }

       //console.log(stockProducts[0].products[0].sellerId.toString())
       //console.log('unique :', unique);

        console.log('card _total :', card_total);
        console.log('out OfStockProduct :', outOfStockProduct);
       
         console.log('calculatePrice :', calculatePrice);

        if (card_products.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé pour cet utilisateur." });
        }

        return res.status(200).json({ products: card_products });
    } catch (error) {
        console.error("Erreur lors de la récupération des produits du panier :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
*/
/*
export const get_card = async (req, res) => {
    const { id } = req.params;
    const commission = 5;

    try {
        // Conversion de l'ID reçu en ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // Récupération des produits du panier
        const card_products = await cardModel.aggregate([
            {
                $match: {
                    customerId: objectId, // Comparaison avec ObjectId
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products",
                },
            },
        ]);

        if (card_products.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé pour cet utilisateur." });
        }

        let calculatePrice = 0; // Prix total des produits en stock
        let card_total = 0; // Total des quantités
        const outOfStockProducts = []; // Produits en rupture de stock
        const stockProducts = []; // Produits en stock

        // Séparer les produits en stock et hors stock
        for (const product of card_products) {
            const productInfo = product.products[0];
            if (productInfo.stock < product.quantity) {
                outOfStockProducts.push(product);
                card_total += product.quantity; // Inclure même les produits hors stock dans le total
            } else {
                stockProducts.push(product);
            }
        }

        // Calculer le prix total et regrouper par vendeur
        const p = [];
        const uniqueSellers = [...new Set(stockProducts.map(product => product.products[0].sellerId.toString()))];

        for (const sellerId of uniqueSellers) {
            let price = 0;
            const sellerProducts = stockProducts.filter(
                product => product.products[0].sellerId.toString() === sellerId
            );

            for (const product of sellerProducts) {
                const tempProduct = product.products[0];
                const quantity = product.quantity;

                let productPrice = tempProduct.price;
                if (tempProduct.discount !== 0) {
                    productPrice *= 1 - tempProduct.discount / 100;
                }

                productPrice *= (1 - commission / 100);
                price += productPrice * quantity;

                p.push({
                    sellerId,
                    shopName: tempProduct.shopName,
                    price,
                    products: p.find(seller => seller.sellerId === sellerId)
                        ? [
                              ...p.find(seller => seller.sellerId === sellerId).products,
                              {
                                  _id: product._id,
                                  quantity,
                                  productInfo: tempProduct,
                              },
                          ]
                        : [
                              {
                                  _id: product._id,
                                  quantity,
                                  productInfo: tempProduct,
                              },
                          ],
                });
            }
        }

        // Calculer le prix total pour tous les produits en stock
        for (const product of stockProducts) {
            const tempProduct = product.products[0];
            const quantity = product.quantity;

            card_total += quantity;

            if (tempProduct.discount !== 0) {
                calculatePrice += (tempProduct.price * quantity) * (1 - tempProduct.discount / 100);
            } else {
                calculatePrice += tempProduct.price * quantity;
            }
        }
       // console.log('card _total', card_total);
       // console.log('calculatePrice', calculatePrice);
       // console.log('out of stock', outOfStockProducts);
        //console.log('p', p);

        // Résultat final
        return responseReturn(res, 200, {
            card_total,
            price : calculatePrice,
            outOfStock_products :outOfStockProducts,
            //stockProducts,
           // groupedBySeller: p,
            card_products : p,
            shipping_fee : 85*p.length,
        });
       
    } catch (error) {
        console.error("Erreur lors de la récupération des produits du panier :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
*/
/*
export const get_card = async (req, res) => {
    const { id } = req.params;
    const commission = 5;

    try {
        // Conversion de l'ID reçu en ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // Récupération des produits du panier
        const card_products = await cardModel.aggregate([
            {
                $match: {
                    customerId: objectId, // Comparaison avec ObjectId
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "products",
                },
            },
        ]);

        if (card_products.length === 0) {
            return res.status(404).json({ message: "Aucun produit trouvé pour cet utilisateur." });
        }

        let calculatePrice = 0; // Prix total des produits en stock
        let card_total = 0; // Total des quantités
        const outOfStockProducts = []; // Produits en rupture de stock
        const stockProducts = []; // Produits en stock

        // Séparer les produits en stock et hors stock
        for (const product of card_products) {
            const productInfo = product.products[0];
            if (productInfo.stock < product.quantity) {
                outOfStockProducts.push(product);
                card_total += product.quantity; // Inclure même les produits hors stock dans le total
            } else {
                stockProducts.push(product);
            }
        }

        // Calculer le prix total et regrouper par vendeur
        const sellerMap = new Map(); // Utilisation d'une Map pour éviter les duplications

        for (const product of stockProducts) {
            const tempProduct = product.products[0];
            const sellerId = tempProduct.sellerId.toString();
            const quantity = product.quantity;

            let productPrice = tempProduct.price;
            if (tempProduct.discount !== 0) {
                productPrice *= 1 - tempProduct.discount / 100;
            }
            productPrice *= (1 - commission / 100);

            // Mettre à jour les informations du vendeur
            if (!sellerMap.has(sellerId)) {
                sellerMap.set(sellerId, {
                    sellerId,
                    shopName: tempProduct.shopName,
                    price: 0,
                    products: [],
                });
            }

            const sellerInfo = sellerMap.get(sellerId);
            sellerInfo.price += productPrice * quantity;
            sellerInfo.products.push({
                _id: product._id,
                quantity,
                productInfo: tempProduct,
            });

            card_total += quantity; // Mise à jour du total des quantités
            calculatePrice += productPrice * quantity; // Mise à jour du prix total
        }

        // Conversion des informations des vendeurs en tableau
        const p = Array.from(sellerMap.values());

        // Résultat final
        return responseReturn(res, 200, {
            card_total,
            price: calculatePrice,
            outOfStock_products: outOfStockProducts,
            card_products: p,
            shipping_fee: 85 * p.length,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des produits du panier :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};
*/

var get_cards = exports.get_cards = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var id, commission, objectId, card_products, buy_products_total, calculatePrice, card_total, outOfStockProducts, stockProducts, _iterator, _step, _product, productInfo, sellerMap, _i, _stockProducts, product, tempProduct, sellerId, quantity, productPrice, sellerInfo, p;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          commission = 0;
          console.log(' request params', req.params);
          _context2.prev = 3;
          if (!(!id || !_mongoose["default"].Types.ObjectId.isValid(id))) {
            _context2.next = 6;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 6:
          // Conversion de l'ID en ObjectId
          objectId = _mongoose["default"].Types.ObjectId.createFromHexString(id); // Récupération des produits du panier
          _context2.next = 9;
          return _cardModel["default"].aggregate([{
            $match: {
              customerId: objectId // Comparaison avec ObjectId
            }
          }, {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "products"
            }
          }]);
        case 9:
          card_products = _context2.sent;
          if (!(card_products.length === 0)) {
            _context2.next = 12;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Votre Panier est vide."
          }));
        case 12:
          buy_products_total = 0; // Total des produits achetés (en stock uniquement)
          calculatePrice = 0; // Prix total des produits en stock
          card_total = 0; // Total des quantités
          outOfStockProducts = []; // Produits en rupture de stock
          stockProducts = []; // Produits en stock
          // Séparer les produits en stock et hors stock
          _iterator = _createForOfIteratorHelper(card_products);
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              _product = _step.value;
              productInfo = _product.products[0];
              if (productInfo.stock < _product.quantity) {
                outOfStockProducts.push(_product);
                card_total += _product.quantity; // Inclure même les produits hors stock dans le total
              } else {
                stockProducts.push(_product);
                buy_products_total += _product.quantity; // Ajouter uniquement les produits en stock
              }
            }

            // Calculer le prix total et regrouper par vendeur
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          sellerMap = new Map();
          for (_i = 0, _stockProducts = stockProducts; _i < _stockProducts.length; _i++) {
            product = _stockProducts[_i];
            tempProduct = product.products[0];
            sellerId = tempProduct.sellerId.toString();
            quantity = product.quantity;
            productPrice = tempProduct.price;
            if (tempProduct.discount !== 0) {
              productPrice *= 1 - tempProduct.discount / 100;
            }
            productPrice *= 1 - commission / 100;
            if (!sellerMap.has(sellerId)) {
              sellerMap.set(sellerId, {
                sellerId: sellerId,
                shopName: tempProduct.shopName,
                price: 0,
                products: []
              });
            }
            sellerInfo = sellerMap.get(sellerId);
            sellerInfo.price += productPrice * quantity;
            sellerInfo.products.push({
              _id: product._id,
              quantity: quantity,
              productInfo: tempProduct
            });
            card_total += quantity;
            calculatePrice += productPrice * quantity;
            // calculatePrice += Math.round((productPrice * quantity) * 100) / 100;
          }

          //console.log('buy _products_total:', buy_products_total);
          p = Array.from(sellerMap.values());
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 200, {
            card_total: card_total,
            buy_products_total: buy_products_total,
            // Ajout du total des produits à acheter
            price: calculatePrice.toFixed(2),
            outOfStock_products: outOfStockProducts,
            card_products: p,
            //shipping_fee: 85 * p.length,
            shipping_fee: 85 * buy_products_total
          }));
        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](3);
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur interne du serveur."
          }));
        case 28:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 25]]);
  }));
  return function get_cards(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var delete_card_product = exports.delete_card_product = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var id, deletedCard;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.cardId; // ID du produit à supprimer
          console.log('id :', id);
          _context3.prev = 2;
          if (!(!id || !_mongoose["default"].Types.ObjectId.isValid(id))) {
            _context3.next = 5;
            break;
          }
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID produit invalide."
          }));
        case 5:
          _context3.next = 7;
          return _cardModel["default"].findByIdAndDelete(id);
        case 7:
          deletedCard = _context3.sent;
          if (deletedCard) {
            _context3.next = 10;
            break;
          }
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Produit introuvable."
          }));
        case 10:
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Produit supprimé avec succès."
          }));
        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](2);
          console.error("Erreur lors de la suppression du produit :", _context3.t0.message);
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur lors de la suppression du produit."
          }));
        case 17:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[2, 13]]);
  }));
  return function delete_card_product(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
/*
export const update_product_quantity = async (req, res) => {
    const id = req.params.cardId; // ID du produit à modifier
    const state = req.body.state; // Nouveau stock
    console.log('id :', id);
  
    console.log('state etat :', state);
   try {
    // Vérifiez si l'ID est valide
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        //console.log(' ID non valide');
        return responseReturn(res, 400, { message: "ID produit invalide." });
    }
    const product = await cardModel.findById(id);
    //console.log('product :', product);
    if (!product) {
        return responseReturn(res, 404, { message: "Produit introuvable." });
    }
    const { quantity } = product;

    if (state === 'inc_cart') {
        await cardModel.findByIdAndUpdate(id,
            { 
               quantity: quantity + 1 
            });
    }

    if (state === 'dec_cart') {
        await cardModel.findByIdAndUpdate(id,
            { 
               quantity: quantity - 1 
            });
    }
    //  console.log(' quantity :', quantity);

    return responseReturn(res, 200, { message: "Quantité mise à jour avec succès ." });
   } catch (error) {
    console.error("Erreur lors de la mise à jour de la quantité du produit :", error.messag );
    return responseReturn(res, 500, { message: "Erreur lors de la mise à jour de la quantité du produit." });
   }
}
*/
var update_product_quantity = exports.update_product_quantity = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var id, state, product, quantity, stock;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.cardId; // ID du produit à modifier
          state = req.body.state; // Nouveau stock
          //console.log('id :', id);
          //console.log('state etat :', state);
          _context4.prev = 2;
          if (!(!id || !_mongoose["default"].Types.ObjectId.isValid(id))) {
            _context4.next = 5;
            break;
          }
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID produit invalide."
          }));
        case 5:
          _context4.next = 7;
          return _cardModel["default"].findById(id);
        case 7:
          product = _context4.sent;
          if (product) {
            _context4.next = 10;
            break;
          }
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Produit introuvable."
          }));
        case 10:
          quantity = product.quantity, stock = product.stock;
          if (!(state === 'inc_cart')) {
            _context4.next = 16;
            break;
          }
          if (!(quantity + 1 > stock)) {
            _context4.next = 14;
            break;
          }
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "La quantité maximale en stock est atteinte."
          }));
        case 14:
          _context4.next = 16;
          return _cardModel["default"].findByIdAndUpdate(id, {
            quantity: quantity + 1
          });
        case 16:
          if (!(state === 'dec_cart')) {
            _context4.next = 21;
            break;
          }
          if (!(quantity - 1 < 0)) {
            _context4.next = 19;
            break;
          }
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "La quantité ne peut pas être négative."
          }));
        case 19:
          _context4.next = 21;
          return _cardModel["default"].findByIdAndUpdate(id, {
            quantity: quantity - 1
          });
        case 21:
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Quantité mise à jour avec succès."
          }));
        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](2);
          console.error("Erreur lors de la mise à jour de la quantité du produit :", _context4.t0.message);
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur lors de la mise à jour de la quantité du produit."
          }));
        case 28:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[2, 24]]);
  }));
  return function update_product_quantity(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var get_card = exports.get_card = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var id, commission, objectId, card_products, result;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          commission = 0; //console.log('Request params:', req.params);
          // Vérification préliminaire de l'ID
          if (!(!id || !_mongoose["default"].Types.ObjectId.isValid(id))) {
            _context5.next = 5;
            break;
          }
          console.log("ID utilisateur invalide :", id);
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 5:
          _context5.prev = 5;
          objectId = _mongoose["default"].Types.ObjectId.createFromHexString(id);
          _context5.next = 9;
          return _cardModel["default"].aggregate([{
            $match: {
              customerId: objectId
            }
          }, {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "products"
            }
          }]);
        case 9:
          card_products = _context5.sent;
          if (!(card_products.length === 0)) {
            _context5.next = 12;
            break;
          }
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Panier vide."
          }));
        case 12:
          // Calculs et traitements des produits...
          result = processCardProducts(card_products, commission);
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 200, result));
        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](5);
          console.error("Erreur backend:", _context5.t0);
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur interne du serveur."
          }));
        case 20:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[5, 16]]);
  }));
  return function get_card(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
function processCardProducts(card_products, commission) {
  var buy_products_total = 0;
  var calculatePrice = 0;
  var card_total = 0;
  var outOfStockProducts = [];
  var stockProducts = [];
  var sellerMap = new Map();
  var _iterator2 = _createForOfIteratorHelper(card_products),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var product = _step2.value;
      var productInfo = product.products[0];
      if (productInfo.stock < product.quantity) {
        outOfStockProducts.push(product);
        card_total += product.quantity;
      } else {
        stockProducts.push(product);
        buy_products_total += product.quantity;
        var tempProduct = product.products[0];
        var sellerId = tempProduct.sellerId.toString();
        var quantity = product.quantity;
        var productPrice = tempProduct.price * (1 - (tempProduct.discount || 0) / 100);
        productPrice *= 1 - commission / 100;
        if (!sellerMap.has(sellerId)) {
          sellerMap.set(sellerId, {
            sellerId: sellerId,
            shopName: tempProduct.shopName,
            price: 0,
            products: []
          });
        }
        var sellerInfo = sellerMap.get(sellerId);
        sellerInfo.price += productPrice * quantity;
        sellerInfo.products.push(_objectSpread(_objectSpread({}, product), {}, {
          productInfo: tempProduct
        }));
        card_total += quantity;
        calculatePrice += productPrice * quantity;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return {
    card_total: card_total,
    buy_products_total: buy_products_total,
    price: calculatePrice.toFixed(2),
    outOfStock_products: outOfStockProducts,
    card_products: Array.from(sellerMap.values()),
    shipping_fee: 85 * buy_products_total
  };
}
var add_to_wishlist = exports.add_to_wishlist = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var slug, wishlist, _wishlist;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          //const {customerId, productId} = req.body;
          slug = req.body.info.slug; //console.log(' slug', slug);
          //console.log(' req body ', req.body.info);
          _context6.prev = 1;
          _context6.next = 4;
          return _wishlistModel["default"].findOne({
            slug: slug
          });
        case 4:
          wishlist = _context6.sent;
          if (!wishlist) {
            _context6.next = 9;
            break;
          }
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Product already in wishlist"
          }));
        case 9:
          _wishlist = new _wishlistModel["default"]({
            customerId: req.body.info.customerId,
            productId: req.body.info.productId,
            name: req.body.info.name,
            price: req.body.info.price,
            image: req.body.info.image,
            discount: req.body.info.discount,
            rating: req.body.info.rating,
            slug: req.body.info.slug
          });
          _context6.next = 12;
          return _wishlist.save();
        case 12:
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Product added to wishlist",
            wishlist: _wishlist
          }));
        case 13:
          _context6.next = 19;
          break;
        case 15:
          _context6.prev = 15;
          _context6.t0 = _context6["catch"](1);
          console.log(_context6.t0);
          (0, _response.responseReturn)(res, 500, {
            error: _context6.t0.message
          });
        case 19:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 15]]);
  }));
  return function add_to_wishlist(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var get_wishlist_products = exports.get_wishlist_products = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var customerId, customerobjectId, wishlists, wishList_count;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          //console.log('customerId ', req.params.customerId);
          customerId = req.params.customerId;
          _context7.prev = 1;
          if (!(!customerId || !_mongoose["default"].Types.ObjectId.isValid(customerId))) {
            _context7.next = 4;
            break;
          }
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 4:
          customerobjectId = _mongoose["default"].Types.ObjectId.createFromHexString(customerId);
          _context7.next = 7;
          return _wishlistModel["default"].find({
            customerId: customerobjectId
          }).sort({
            createdAt: -1
          });
        case 7:
          wishlists = _context7.sent;
          if (wishlists) {
            _context7.next = 10;
            break;
          }
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "No wishlist found"
          }));
        case 10:
          _context7.next = 12;
          return _wishlistModel["default"].countDocuments({
            customerId: customerobjectId
          });
        case 12:
          wishList_count = _context7.sent;
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: 'wishlist found',
            wishlists: wishlists,
            wishList_count: wishList_count
          }));
        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](1);
          console.log(_context7.t0);
          (0, _response.responseReturn)(res, 500, {
            error: 'error fetching wishlist'
          });
        case 20:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[1, 16]]);
  }));
  return function get_wishlist_products(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
/*
export const delete_wishlist_product = async (req, res) => {
    console.log(req.params);
}*/

var delete_wishlist_product = exports.delete_wishlist_product = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var wishlistId, deletedwishlistId;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          wishlistId = req.params.wishlistId; // ID du produit à supprimer
          //console.log('wishlistId :', wishlistId);
          _context8.prev = 1;
          if (!(!wishlistId || !_mongoose["default"].Types.ObjectId.isValid(wishlistId))) {
            _context8.next = 4;
            break;
          }
          return _context8.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID produit invalide."
          }));
        case 4:
          _context8.next = 6;
          return _wishlistModel["default"].findByIdAndDelete(wishlistId);
        case 6:
          deletedwishlistId = _context8.sent;
          if (deletedwishlistId) {
            _context8.next = 9;
            break;
          }
          return _context8.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Produit introuvable."
          }));
        case 9:
          return _context8.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Produit supprimé avec succès."
          }));
        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](1);
          console.error("Erreur lors de la suppression du produit :", _context8.t0.message);
          return _context8.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur lors de la suppression du produit."
          }));
        case 16:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[1, 12]]);
  }));
  return function delete_wishlist_product(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();