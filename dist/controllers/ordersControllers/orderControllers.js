"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seller_order_status_update = exports.place_order = exports.payment_check = exports.order_confirm = exports.get_seller_orders = exports.get_seller_order_by_ID = exports.get_orders = exports.get_order_by_id = exports.get_dashboard_data = exports.get_admin_orders = exports.get_admin_order_by_ID = exports.create_payment = exports.admin_order_status_update = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _stripe = _interopRequireDefault(require("stripe"));
var _authOrderModel = _interopRequireDefault(require("../../models/authOrderModel.js"));
var _cardModel = _interopRequireDefault(require("../../models/cardModel.js"));
var _customerOrderModel = _interopRequireDefault(require("../../models/customerOrderModel.js"));
var _myShopWalletModel = _interopRequireDefault(require("../../models/myShopWalletModel.js"));
var _sellerWalletModel = _interopRequireDefault(require("../../models/sellerWalletModel.js"));
var _response = require("../../utiles/response.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } // Assure-toi que tu utilises une version compatible ES Modules.
var stripe = new _stripe["default"](process.env.STRIPE_SECRET_KEY); // Utilise la clé depuis l'environnement.

var payment_check = exports.payment_check = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(id) {
    var objectId, order;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          if (!(!id || !_mongoose["default"].Types.ObjectId.isValid(id))) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", {
            success: false,
            message: "ID utilisateur invalide."
          });
        case 3:
          objectId = _mongoose["default"].Types.ObjectId.createFromHexString(id);
          _context.next = 6;
          return _customerOrderModel["default"].findById(objectId);
        case 6:
          order = _context.sent;
          if (order) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", {
            success: false,
            message: "Aucun ordre trouvé."
          });
        case 9:
          if (!(order.payment_status === "unpaid")) {
            _context.next = 15;
            break;
          }
          _context.next = 12;
          return _customerOrderModel["default"].findByIdAndUpdate(objectId, {
            delivery_status: "cancelled"
          });
        case 12:
          _context.next = 14;
          return _authOrderModel["default"].updateMany({
            orderId: objectId
          }, {
            delivery_status: "cancelled"
          });
        case 14:
          return _context.abrupt("return", {
            success: true,
            message: "Commande annulée en raison d'un paiement non effectué."
          });
        case 15:
          return _context.abrupt("return", {
            success: true,
            message: "Paiement vérifié avec succès."
          });
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.log("Erreur dans payment_check :", _context.t0.message);
          return _context.abrupt("return", {
            success: false,
            message: "Erreur lors de la vérification du paiement."
          });
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 18]]);
  }));
  return function payment_check(_x) {
    return _ref.apply(this, arguments);
  };
}();
var place_order = exports.place_order = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$body, products, price, Shipping_fees, items, shippingInfo, customerId, authOrderData, cardId, tempDate, customerOrderProducts, i, product, j, tempProduct, userId, order, _i, _product, prix, Id, sellerId, storeProduct, _j, _tempProduct, k, cardIdTemp, cardDelId;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, products = _req$body.products, price = _req$body.price, Shipping_fees = _req$body.Shipping_fees, items = _req$body.items, shippingInfo = _req$body.shippingInfo, customerId = _req$body.customerId;
          authOrderData = [];
          cardId = [];
          tempDate = (0, _moment["default"])(Date.now()).format('LLL');
          console.log('order items :>> ', items);
          customerOrderProducts = [];
          for (i = 0; i < products.length; i++) {
            product = products[i].products;
            for (j = 0; j < product.length; j++) {
              tempProduct = product[j].productInfo; //console.log(`tempProduct_${i}${j} : `, tempProduct);
              tempProduct.quantity = product[j].quantity;
              customerOrderProducts.push(tempProduct);
              if (product[j]._id) {
                cardId.push(product[j]._id);
              }
            }
          }
          //console.log(`customer Order Products` , customerOrderProducts);    
          //console.log(`cardId `, cardId);
          _context3.prev = 7;
          if (!(!customerId || !_mongoose["default"].Types.ObjectId.isValid(customerId))) {
            _context3.next = 10;
            break;
          }
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID utilisateur invalide."
          }));
        case 10:
          // Conversion de l'ID en ObjectId
          userId = _mongoose["default"].Types.ObjectId.createFromHexString(customerId);
          _context3.next = 13;
          return _customerOrderModel["default"].create({
            customerId: userId,
            products: customerOrderProducts,
            price: price + Shipping_fees,
            quantity: items,
            payment_status: 'unpaid',
            shippingInfo: shippingInfo,
            delivery_status: 'pending',
            date: tempDate
          });
        case 13:
          order = _context3.sent;
          _i = 0;
        case 15:
          if (!(_i < products.length)) {
            _context3.next = 35;
            break;
          }
          _product = products[_i].products;
          prix = products[_i].price;
          Id = products[_i].sellerId;
          if (!(!Id || !_mongoose["default"].Types.ObjectId.isValid(Id))) {
            _context3.next = 21;
            break;
          }
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID vendeur invalide."
          }));
        case 21:
          sellerId = _mongoose["default"].Types.ObjectId.createFromHexString(Id);
          storeProduct = [];
          for (_j = 0; _j < _product.length; _j++) {
            _tempProduct = _product[_j].productInfo;
            _tempProduct.quantity = _product[_j].quantity;
            storeProduct.push(_tempProduct);
          }
          _context3.prev = 24;
          /*
          console.log({
              orderId: order.id,
              sellerId: sellerId,
              products: storeProduct,
              price: prix,
              payment_status: 'unpaid',
              shippingInfo: 'Rabat, 17 rue des Olives, 10000',
              delivery_status: 'pending',
              date: tempDate,
          });
          */
          authOrderData.push({
            orderId: order.id,
            sellerId: sellerId,
            products: storeProduct,
            price: prix,
            payment_status: 'unpaid',
            shippingInfo: 'Rabat, 17 rue des Olives, 10000',
            delivery_status: 'pending',
            date: tempDate
          });
          _context3.next = 32;
          break;
        case 28:
          _context3.prev = 28;
          _context3.t0 = _context3["catch"](24);
          console.log("Erreur d'envoie de commandes.", _context3.t0);
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur d'envoie de commandes."
          }));
        case 32:
          _i++;
          _context3.next = 15;
          break;
        case 35:
          _context3.next = 37;
          return _authOrderModel["default"].insertMany(authOrderData);
        case 37:
          k = 0;
        case 38:
          if (!(k < cardId.length)) {
            _context3.next = 48;
            break;
          }
          cardIdTemp = cardId[k];
          if (!(!cardIdTemp || !_mongoose["default"].Types.ObjectId.isValid(cardIdTemp))) {
            _context3.next = 42;
            break;
          }
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID vendeur invalide."
          }));
        case 42:
          cardDelId = _mongoose["default"].Types.ObjectId.createFromHexString(cardIdTemp);
          _context3.next = 45;
          return _cardModel["default"].findByIdAndDelete(cardDelId);
        case 45:
          k++;
          _context3.next = 38;
          break;
        case 48:
          //setTimeout(()=> {this.payment_check(order.id)} , 5000);
          // Vérification du paiement après 5 secondes
          setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            var paymentResult;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return payment_check(order.id);
                case 2:
                  paymentResult = _context2.sent;
                  if (!paymentResult.success) {
                    console.log(paymentResult.message);
                  }
                case 4:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          })), 5000);
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 201, {
            message: "order placed successfully",
            orderId: order.id
          }));
        case 52:
          _context3.prev = 52;
          _context3.t1 = _context3["catch"](7);
          console.log(_context3.t1);
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error placing order"
          }));
        case 56:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[7, 52], [24, 28]]);
  }));
  return function place_order(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var get_orders = exports.get_orders = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var parPage, _req$params, customerId, status, customerObjectId, myOrders, totalOrder, pageNumber, startIndex, paginatedOrders;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          // console.log('get order is running :>> req params :', req.params);
          parPage = 5;
          _req$params = req.params, customerId = _req$params.customerId, status = _req$params.status; //const {pageNumber} = req.query
          //console.log(' pageNumber :>> ', req.query);
          _context4.prev = 2;
          if (!(!customerId || !_mongoose["default"].Types.ObjectId.isValid(customerId))) {
            _context4.next = 5;
            break;
          }
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 5:
          // Conversion de l'ID en ObjectId
          customerObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(customerId);
          myOrders = [];
          if (!(status !== 'all')) {
            _context4.next = 13;
            break;
          }
          _context4.next = 10;
          return _customerOrderModel["default"].find({
            customerId: customerObjectId,
            delivery_status: status
          }).sort({
            createdAt: -1
          });
        case 10:
          myOrders = _context4.sent;
          _context4.next = 16;
          break;
        case 13:
          _context4.next = 15;
          return _customerOrderModel["default"].find({
            customerId: customerObjectId
          }).sort({
            createdAt: -1
          });
        case 15:
          myOrders = _context4.sent;
        case 16:
          _context4.next = 18;
          return _customerOrderModel["default"].countDocuments({
            customerId: customerObjectId
          });
        case 18:
          totalOrder = _context4.sent;
          // Appliquez la pagination
          pageNumber = Number(req.query.pageNumber) || 1;
          startIndex = (pageNumber - 1) * parPage;
          paginatedOrders = myOrders.slice(startIndex, startIndex + parPage); //  console.log(' paginatedOrders', paginatedOrders );
          // console.log('orders :>> ', orders);
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: 'Successful Orders request',
            paginatedOrders: paginatedOrders,
            totalOrder: totalOrder,
            parPage: parPage
          }));
        case 25:
          _context4.prev = 25;
          _context4.t0 = _context4["catch"](2);
          console.log(_context4.t0);
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error fetching order"
          }));
        case 29:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[2, 25]]);
  }));
  return function get_orders(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();
var get_dashboard_data = exports.get_dashboard_data = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var customerId, customerObjectId, recentOrder, pendingOrder, cancelledOrder, totalOrder;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          // console.log('get order is running :>> req params :', req.params);
          /* const {customerId} = req.app.get('/books/:bookId', (req, res)=>{
               res.send(req.params.bookId)
           });*/
          customerId = req.params.customerId;
          _context5.prev = 1;
          if (!(!customerId || !_mongoose["default"].Types.ObjectId.isValid(customerId))) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 4:
          // Conversion de l'ID en ObjectId
          customerObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(customerId);
          _context5.next = 7;
          return _customerOrderModel["default"].find({
            customerId: customerObjectId
          }).sort({
            createdAt: -1
          }).limit(5);
        case 7:
          recentOrder = _context5.sent;
          _context5.next = 10;
          return _customerOrderModel["default"].countDocuments({
            customerId: customerObjectId,
            delivery_status: 'pending'
          }).sort({
            createdAt: -1
          });
        case 10:
          pendingOrder = _context5.sent;
          _context5.next = 13;
          return _customerOrderModel["default"].countDocuments({
            customerId: customerObjectId,
            delivery_status: 'cancelled'
          }).sort({
            createdAt: -1
          });
        case 13:
          cancelledOrder = _context5.sent;
          _context5.next = 16;
          return _customerOrderModel["default"].countDocuments({
            customerId: customerObjectId
          });
        case 16:
          totalOrder = _context5.sent;
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: 'Successful Orders request',
            recentOrder: recentOrder,
            pendingOrder: pendingOrder,
            cancelledOrder: cancelledOrder,
            totalOrder: totalOrder
          }));
        case 20:
          _context5.prev = 20;
          _context5.t0 = _context5["catch"](1);
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error fetching order"
          }));
        case 23:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 20]]);
  }));
  return function get_dashboard_data(_x6, _x7) {
    return _ref5.apply(this, arguments);
  };
}();
var get_order_by_id = exports.get_order_by_id = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var orderId, orderObjectId, order;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          orderId = req.params.orderId; // console.log('get order by id is running :>> req params :', req.params);
          _context6.prev = 1;
          if (!(!orderId || !_mongoose["default"].Types.ObjectId.isValid(orderId))) {
            _context6.next = 4;
            break;
          }
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 4:
          orderObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(orderId);
          _context6.next = 7;
          return _customerOrderModel["default"].findById(orderObjectId);
        case 7:
          order = _context6.sent;
          if (order) {
            _context6.next = 10;
            break;
          }
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Order not found"
          }));
        case 10:
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Order found",
            order: order
          }));
        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](1);
          console.log('error :>> ', _context6.t0);
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error fetching order"
          }));
        case 17:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 13]]);
  }));
  return function get_order_by_id(_x8, _x9) {
    return _ref6.apply(this, arguments);
  };
}();
var get_admin_orders = exports.get_admin_orders = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var _req$query, page, searchValue, parPage, skipPage, orders, totalOrder;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          //console.log('req query', req.query);
          _req$query = req.query, page = _req$query.page, searchValue = _req$query.searchValue, parPage = _req$query.parPage;
          page = parseInt(page);
          parPage = parseInt(parPage);
          skipPage = parPage * (page - 1);
          _context7.prev = 4;
          if (!searchValue) {
            _context7.next = 8;
            break;
          }
          _context7.next = 15;
          break;
        case 8:
          _context7.next = 10;
          return _customerOrderModel["default"].aggregate([{
            $lookup: {
              from: 'authorders',
              localField: '_id',
              foreignField: 'orderId',
              as: 'subOrder'
            }
          }]).skip(skipPage).limit(parPage).sort({
            createdAt: -1
          });
        case 10:
          orders = _context7.sent;
          _context7.next = 13;
          return _customerOrderModel["default"].countDocuments([{
            $lookup: {
              from: 'authorders',
              localField: '_id',
              foreignField: 'orderId',
              as: 'subOrder'
            }
          }]);
        case 13:
          totalOrder = _context7.sent;
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 200, {
            orders: orders,
            totalOrder: totalOrder
          }));
        case 15:
          _context7.next = 21;
          break;
        case 17:
          _context7.prev = 17;
          _context7.t0 = _context7["catch"](4);
          console.log('error :>> ', _context7.t0);
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error fetching orders"
          }));
        case 21:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[4, 17]]);
  }));
  return function get_admin_orders(_x10, _x11) {
    return _ref7.apply(this, arguments);
  };
}();
var get_admin_order_by_ID = exports.get_admin_order_by_ID = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var orderId, orderObjectId, order;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          //console.log('params ', req.params)
          orderId = req.params.orderId;
          _context8.prev = 1;
          if (!(!orderId || !_mongoose["default"].Types.ObjectId.isValid(orderId))) {
            _context8.next = 4;
            break;
          }
          return _context8.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 4:
          orderObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(orderId);
          _context8.next = 7;
          return _customerOrderModel["default"].aggregate([{
            $match: {
              _id: orderObjectId
            }
          }, {
            $lookup: {
              from: 'authorders',
              localField: '_id',
              foreignField: 'orderId',
              as: 'subOrder'
            }
          }]);
        case 7:
          order = _context8.sent;
          return _context8.abrupt("return", (0, _response.responseReturn)(res, 200, {
            order: order[0]
          }));
        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](1);
          console.log('error :>> ', _context8.t0);
          return _context8.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error fetching order"
          }));
        case 15:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[1, 11]]);
  }));
  return function get_admin_order_by_ID(_x12, _x13) {
    return _ref8.apply(this, arguments);
  };
}();
var admin_order_status_update = exports.admin_order_status_update = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var status, orderId, orderObjectId, order;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          status = req.body.status;
          orderId = req.params.orderId; // console.log('req.body :>> ', req.body);
          // console.log('req params ', req.params);
          _context9.prev = 2;
          if (!(!orderId || !_mongoose["default"].Types.ObjectId.isValid(orderId))) {
            _context9.next = 5;
            break;
          }
          return _context9.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 5:
          orderObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(orderId);
          _context9.next = 8;
          return _customerOrderModel["default"].findByIdAndUpdate(orderObjectId, {
            delivery_status: status
          });
        case 8:
          order = _context9.sent;
          if (order) {
            _context9.next = 11;
            break;
          }
          return _context9.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Order not found"
          }));
        case 11:
          return _context9.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Order status updated successfully"
          }));
        case 14:
          _context9.prev = 14;
          _context9.t0 = _context9["catch"](2);
          console.log('error :>> ', _context9.t0);
          return _context9.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error updating order status"
          }));
        case 18:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[2, 14]]);
  }));
  return function admin_order_status_update(_x14, _x15) {
    return _ref9.apply(this, arguments);
  };
}();
var get_seller_orders = exports.get_seller_orders = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var sellerId, _req$query2, page, searchValue, parPage, skipPage, orders, totalOrders;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          //console.log('req query', req.query);
          //console.log('req params ', req.params);
          sellerId = req.params.sellerId;
          _req$query2 = req.query, page = _req$query2.page, searchValue = _req$query2.searchValue, parPage = _req$query2.parPage;
          page = parseInt(page);
          parPage = parseInt(parPage);
          skipPage = parPage * (page - 1);
          _context10.prev = 5;
          if (!searchValue) {
            _context10.next = 9;
            break;
          }
          _context10.next = 16;
          break;
        case 9:
          _context10.next = 11;
          return _authOrderModel["default"].find({
            sellerId: sellerId
          }).skip(skipPage).limit(parPage).sort({
            createdAt: -1
          });
        case 11:
          orders = _context10.sent;
          _context10.next = 14;
          return _authOrderModel["default"].countDocuments({
            sellerId: sellerId
          });
        case 14:
          totalOrders = _context10.sent;
          return _context10.abrupt("return", (0, _response.responseReturn)(res, 200, {
            orders: orders,
            totalOrders: totalOrders
          }));
        case 16:
          _context10.next = 22;
          break;
        case 18:
          _context10.prev = 18;
          _context10.t0 = _context10["catch"](5);
          console.log('error :>> ', _context10.t0);
          return _context10.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error fetching orders"
          }));
        case 22:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[5, 18]]);
  }));
  return function get_seller_orders(_x16, _x17) {
    return _ref10.apply(this, arguments);
  };
}();
var get_seller_order_by_ID = exports.get_seller_order_by_ID = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var orderId, order;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          // console.log('params ', req.params)
          orderId = req.params.orderId;
          _context11.prev = 1;
          _context11.next = 4;
          return _authOrderModel["default"].findById(orderId);
        case 4:
          order = _context11.sent;
          return _context11.abrupt("return", (0, _response.responseReturn)(res, 200, {
            order: order
          }));
        case 8:
          _context11.prev = 8;
          _context11.t0 = _context11["catch"](1);
          console.log('error :>> ', _context11.t0);
          return _context11.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error fetching order"
          }));
        case 12:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[1, 8]]);
  }));
  return function get_seller_order_by_ID(_x18, _x19) {
    return _ref11.apply(this, arguments);
  };
}();
var seller_order_status_update = exports.seller_order_status_update = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res) {
    var status, orderId, orderObjectId, order;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          status = req.body.status;
          orderId = req.params.orderId; //console.log('req.body :>> ', req.body);
          // console.log('req params ', req.params);
          _context12.prev = 2;
          if (!(!orderId || !_mongoose["default"].Types.ObjectId.isValid(orderId))) {
            _context12.next = 5;
            break;
          }
          return _context12.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 5:
          orderObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(orderId);
          _context12.next = 8;
          return _authOrderModel["default"].findByIdAndUpdate(orderObjectId, {
            delivery_status: status
          });
        case 8:
          order = _context12.sent;
          if (order) {
            _context12.next = 11;
            break;
          }
          return _context12.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Order not found"
          }));
        case 11:
          return _context12.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Order status updated successfully"
          }));
        case 14:
          _context12.prev = 14;
          _context12.t0 = _context12["catch"](2);
          console.log('error :>> ', _context12.t0);
          return _context12.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error updating order status"
          }));
        case 18:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[2, 14]]);
  }));
  return function seller_order_status_update(_x20, _x21) {
    return _ref12.apply(this, arguments);
  };
}();
/*
export const create_payment = async (req, res) => {
    const { price } = req.body;

    console.log('Price received in request:', price);

    // Validate the price
    if (!price || isNaN(price) || price <= 0) {
        return responseReturn(res, 400, { message: "Invalid price provided" });
    }

    try {
        const payment = await stripe.paymentIntents.create({
            amount: Math.round(price * 100), // Convert to smallest currency unit
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log('Payment Intent created:', payment);
        return responseReturn(res, 200, { clientSecret: payment.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return responseReturn(res, 500, { message: "Error creating payment" });
    }
};
*/

var create_payment = exports.create_payment = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res) {
    var price, payment;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          price = req.body.price; //console.log('Price received in request:', price);
          // Validate the price
          if (!(!price || isNaN(price) || price <= 0)) {
            _context13.next = 3;
            break;
          }
          return _context13.abrupt("return", res.status(400).json({
            message: "Invalid price provided"
          }));
        case 3:
          _context13.prev = 3;
          _context13.next = 6;
          return stripe.paymentIntents.create({
            amount: Math.round(price * 100),
            // Convert price to cents
            currency: 'usd',
            automatic_payment_methods: {
              enabled: true
            }
          });
        case 6:
          payment = _context13.sent;
          // console.log('Payment Intent created:', payment);
          res.status(200).json({
            clientSecret: payment.client_secret
          });
          _context13.next = 14;
          break;
        case 10:
          _context13.prev = 10;
          _context13.t0 = _context13["catch"](3);
          console.error('Error creating payment intent:', _context13.t0);
          res.status(500).json({
            message: "Error creating payment"
          });
        case 14:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[3, 10]]);
  }));
  return function create_payment(_x22, _x23) {
    return _ref13.apply(this, arguments);
  };
}();
var order_confirm = exports.order_confirm = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(req, res) {
    var orderId, orderObjectId, order, customerOrder, authOrder, time, splitTime, i;
    return _regeneratorRuntime().wrap(function _callee14$(_context14) {
      while (1) switch (_context14.prev = _context14.next) {
        case 0:
          orderId = req.params.orderId; //console.log('order id ', orderId);
          _context14.prev = 1;
          _context14.next = 4;
          return _customerOrderModel["default"].findByIdAndUpdate(orderId, {
            payment_status: 'paid',
            delivery_status: 'pending'
          });
        case 4:
          if (!(!orderId || !_mongoose["default"].Types.ObjectId.isValid(orderId))) {
            _context14.next = 6;
            break;
          }
          return _context14.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID invalide"
          }));
        case 6:
          orderObjectId = _mongoose["default"].Types.ObjectId.createFromHexString(orderId);
          _context14.next = 9;
          return _authOrderModel["default"].updateMany({
            orderId: orderObjectId
          }, {
            payment_status: 'paid',
            delivery_status: 'pending'
          });
        case 9:
          order = _context14.sent;
          _context14.next = 12;
          return _customerOrderModel["default"].findById(orderId);
        case 12:
          customerOrder = _context14.sent;
          _context14.next = 15;
          return _authOrderModel["default"].find({
            orderId: orderObjectId
          });
        case 15:
          authOrder = _context14.sent;
          time = (0, _moment["default"])(Date.now()).format('l');
          splitTime = time.split('/');
          _context14.next = 20;
          return _myShopWalletModel["default"].create({
            amount: customerOrder.price,
            month: splitTime[0],
            year: splitTime[2]
          });
        case 20:
          i = 0;
        case 21:
          if (!(i < authOrder.length)) {
            _context14.next = 27;
            break;
          }
          _context14.next = 24;
          return _sellerWalletModel["default"].create({
            sellerId: authOrder[i].sellerId.toString(),
            amount: authOrder[i].price,
            month: splitTime[0],
            year: splitTime[2]
          });
        case 24:
          i++;
          _context14.next = 21;
          break;
        case 27:
          return _context14.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: 'success'
          }));
        case 30:
          _context14.prev = 30;
          _context14.t0 = _context14["catch"](1);
          console.log('error :>> ', _context14.t0);
          return _context14.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Error confirm order"
          }));
        case 34:
        case "end":
          return _context14.stop();
      }
    }, _callee14, null, [[1, 30]]);
  }));
  return function order_confirm(_x24, _x25) {
    return _ref14.apply(this, arguments);
  };
}();