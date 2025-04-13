"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload_profile_image = exports.seller_register = exports.seller_login = exports.profile_info_add = exports.logout = exports.getUser = exports.admin_register = exports.admin_login = void 0;
var _adminModel = _interopRequireDefault(require("../models/adminModel.js"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _sellerModel = _interopRequireDefault(require("../models/sellerModel.js"));
var _sellerCustomerModel = _interopRequireDefault(require("../models/chats/sellerCustomerModel.js"));
var _response = require("../utiles/response.js");
var _smtp_function = _interopRequireDefault(require("../utiles/smtp_function.js"));
var _tokenCreate = require("../utiles/tokenCreate.js");
var _cloudinary = require("cloudinary");
var _debug = _interopRequireDefault(require("debug"));
var _fs = _interopRequireDefault(require("fs"));
var _inspector = require("inspector");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var log = (0, _debug["default"])("app:upload");

// Configuration de Cloudinary
_cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});
var admin_login = exports.admin_login = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var _req$body, email, password, emailRegex, admin, match, token;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // console.log('email admin ' + email);
          //process.stdout.write("email admin : " + email + "\n");
          if (emailRegex.test(email)) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "Email invalide"
          }));
        case 4:
          if (!(password.length < 8)) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", (0, _response.responseReturn)(res, 400, {
            status: false,
            message: "Le mot de passe doit comporter au moins 8 caractères"
          }));
        case 6:
          _context.prev = 6;
          _context.next = 9;
          return _adminModel["default"].findOne({
            email: email
          }).select('+password');
        case 9:
          admin = _context.sent;
          if (admin) {
            _context.next = 12;
            break;
          }
          return _context.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Account not found"
          }));
        case 12:
          _context.next = 14;
          return _bcrypt["default"].compare(password, admin.password);
        case 14:
          match = _context.sent;
          if (!match) {
            _context.next = 23;
            break;
          }
          _context.next = 18;
          return (0, _tokenCreate.createToken)({
            id: admin.id,
            role: admin.role
          });
        case 18:
          token = _context.sent;
          res.cookie('accessToken', token, {
            expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
          });
          return _context.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Connexion réussie",
            token: token
          }));
        case 23:
          return _context.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Mot de passe incorrect"
          }));
        case 24:
          _context.next = 29;
          break;
        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](6);
          return _context.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur interne du serveur"
          }));
        case 29:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[6, 26]]);
  }));
  return function admin_login(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var seller_login = exports.seller_login = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body2, email, password, emailRegex, seller, match, token;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; //process.stdout.write("seller email : " + email + "\n");
          if (emailRegex.test(email)) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "Email invalide"
          }));
        case 4:
          if (!(password.length < 8)) {
            _context2.next = 6;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "Le mot de passe doit comporter au moins 8 caractères"
          }));
        case 6:
          _context2.prev = 6;
          _context2.next = 9;
          return _sellerModel["default"].findOne({
            email: email
          }).select('+password');
        case 9:
          seller = _context2.sent;
          if (seller) {
            _context2.next = 12;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Compte introuvable"
          }));
        case 12:
          _context2.next = 14;
          return _bcrypt["default"].compare(password, seller.password);
        case 14:
          match = _context2.sent;
          if (!match) {
            _context2.next = 23;
            break;
          }
          _context2.next = 18;
          return (0, _tokenCreate.createToken)({
            id: seller.id,
            role: seller.role
          });
        case 18:
          token = _context2.sent;
          res.cookie('accessToken', token, {
            expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
          });
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Connexion réussie",
            token: token
          }));
        case 23:
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Mot de passe incorrect"
          }));
        case 24:
          _context2.next = 29;
          break;
        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](6);
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur interne du serveur"
          }));
        case 29:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[6, 26]]);
  }));
  return function seller_login(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var getUser = exports.getUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var id, role, userInfo;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          id = req.id, role = req.role; // Log to check if id and role are received correctly
          //console.log("User ID:", id, "Role:", role);
          // process.stdout.write("User ID: " + id +"\n" + "Role:" + role + "\n");
          if (!(!id || !role)) {
            _context3.next = 3;
            break;
          }
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "Invalid request: missing user ID or role"
          }));
        case 3:
          _context3.prev = 3;
          if (!(role === 'admin')) {
            _context3.next = 10;
            break;
          }
          _context3.next = 7;
          return _adminModel["default"].findById(id);
        case 7:
          userInfo = _context3.sent;
          _context3.next = 17;
          break;
        case 10:
          if (!(role === 'seller')) {
            _context3.next = 16;
            break;
          }
          _context3.next = 13;
          return _sellerModel["default"].findById(id);
        case 13:
          userInfo = _context3.sent;
          _context3.next = 17;
          break;
        case 16:
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 403, {
            message: "Unauthorized role"
          }));
        case 17:
          if (userInfo) {
            _context3.next = 19;
            break;
          }
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "User not found"
          }));
        case 19:
          (0, _response.responseReturn)(res, 200, {
            userInfo: userInfo
          });
          _context3.next = 26;
          break;
        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](3);
          _inspector.console.error("Server Error:", _context3.t0.message);
          (0, _response.responseReturn)(res, 500, {
            message: "Internal server error",
            error: _context3.t0.message
          });
        case 26:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[3, 22]]);
  }));
  return function getUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var seller_register = exports.seller_register = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var emailRegex, emailExists, hashedPassword, newSeller, token;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          if (!emailRegex.test(req.body.email)) {
            (0, _response.responseReturn)(res, 400, {
              message: "Email invalide"
            });
          }
          if (req.body.password.length < 8) {
            (0, _response.responseReturn)(res, 400, {
              message: "Le mot de passe doit comporter au moins 8 caractères"
            });
            //return res.status(400).json({ status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
          }
          _context4.prev = 3;
          _context4.next = 6;
          return _sellerModel["default"].findOne({
            email: req.body.email
          });
        case 6:
          emailExists = _context4.sent;
          if (emailExists) {
            //return res.status(400).json({ status: false, message: "Email déjà existant" });
            (0, _response.responseReturn)(res, 400, {
              message: "Email déjà existant"
            });
          }
          _context4.next = 10;
          return _bcrypt["default"].hash(req.body.password, 10);
        case 10:
          hashedPassword = _context4.sent;
          // Hachage du mot de passe avec bcrypt
          newSeller = new _sellerModel["default"]({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            // Stockage du mot de passe haché
            role: "seller",
            method: "manual",
            shopInfo: {}
          });
          _context4.next = 14;
          return newSeller.save();
        case 14:
          (0, _smtp_function["default"])(newSeller.email, "Bienvenue chez GOBYMAIL", "Vous êtes désormais inscrit");
          _context4.next = 17;
          return _sellerCustomerModel["default"].create({
            myId: newSeller.id
          });
        case 17:
          _context4.next = 19;
          return (0, _tokenCreate.createToken)({
            id: newSeller.id,
            role: newSeller.role
          });
        case 19:
          token = _context4.sent;
          res.cookie('accessToken', token, {
            expires: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
          });

          //console.log(newSeller);
          (0, _response.responseReturn)(res, 201, {
            message: " Votre  compte vendeur est bien créé",
            token: token
          });
          _context4.next = 27;
          break;
        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](3);
          (0, _response.responseReturn)(res, 500, {
            status: false,
            message: "Erreur Interne du serveur"
          });
        case 27:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[3, 24]]);
  }));
  return function seller_register(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var admin_register = exports.admin_register = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var emailRegex, emailExists, hashedPassword, newUser;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          if (emailRegex.test(req.body.email)) {
            _context5.next = 3;
            break;
          }
          return _context5.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Account not found"
          }));
        case 3:
          if (req.body.password.length < 8) {
            (0, _response.responseReturn)(res, 404, {
              message: "Mot de passe doit contenir au moins 8 caractères"
            });
            //return res.status(400).json({ status: false, message: "Le mot de passe doit comporter au moins 8 caractères" });
          }
          _context5.prev = 4;
          _context5.next = 7;
          return _adminModel["default"].findOne({
            email: req.body.email
          });
        case 7:
          emailExists = _context5.sent;
          if (emailExists) {
            (0, _response.responseReturn)(res, 400, {
              message: "Email déjà utilisé"
            });
          }
          _context5.next = 11;
          return _bcrypt["default"].hash(req.body.password, 10);
        case 11:
          hashedPassword = _context5.sent;
          // Hachage du mot de passe avec bcrypt
          newUser = new _adminModel["default"]({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            // Stockage du mot de passe haché
            role: "admin"
          });
          _context5.next = 15;
          return newUser.save();
        case 15:
          (0, _response.responseReturn)(res, 201, {
            status: true,
            message: "Comptecréé avec succès"
          });
          //res.status(201).json({ status: true, message: "Utilisateur créé avec succès" });
          _context5.next = 21;
          break;
        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](4);
          (0, _response.responseReturn)(res, 500, {
            message: "Erreur Interne du serveur"
          });
        case 21:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[4, 18]]);
  }));
  return function admin_register(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var logout = exports.logout = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          /// console.log("Début de la fonction logout");
          // process.stdout.write("Début de la fonction logout : " + "\n");

          try {
            res.cookie('accessToken', null, {
              expires: new Date(Date.now()),
              httpOnly: true
            });
            (0, _response.responseReturn)(res, 200, {
              message: 'logout success'
            });
          } catch (error) {
            (0, _response.responseReturn)(res, 500, {
              error: error.message
            });
          }
        case 1:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function logout(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

/*
export const logout = async (req, res) => {
    //console.log("Déconnexion en cours...");
    process.stdout.write("Début de la fonction logout : " + "\n");
    res.clearCookie("token").status(200).json({ message: "Logout successfully" });
  };
*/

var upload_profile_image = exports.upload_profile_image = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var id, imagePath, imageName, result, updatedUser, userInfo;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.id; // Assurez-vous que l'ID de l'utilisateur est disponible (par exemple via authMiddleware)
          process.stdout.write(" id profile : " + id + "\n");
          // Vérifiez si un fichier est attaché à la requête
          if (req.file) {
            _context7.next = 5;
            break;
          }
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 400, {
            error: "Aucun fichier fourni"
          }));
        case 5:
          imagePath = req.file.path; // Multer enregistre le fichier temporairement ici
          imageName = req.file.originalname; // Téléversement de l'image sur Cloudinary
          _context7.next = 9;
          return _cloudinary.v2.uploader.upload(imagePath, {
            folder: "GOBYMALL/profile",
            public_id: "profile_".concat(id, "_").concat(Date.now()) // Génère un identifiant unique pour le fichier
          });
        case 9:
          result = _context7.sent;
          if (!(!result || !result.url)) {
            _context7.next = 12;
            break;
          }
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 500, {
            error: "Échec du téléversement de l'image"
          }));
        case 12:
          _context7.next = 14;
          return _sellerModel["default"].findByIdAndUpdate(id, {
            image: result.url
          }, {
            "new": true
          } // Retourne les nouvelles informations après la mise à jour
          );
        case 14:
          updatedUser = _context7.sent;
          if (updatedUser) {
            _context7.next = 17;
            break;
          }
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 404, {
            error: "Utilisateur introuvable"
          }));
        case 17:
          // Suppression du fichier temporaire après l'upload
          _fs["default"].unlink(imagePath, function (err) {
            if (err) {
              _inspector.console.error("Erreur lors de la suppression du fichier temporaire :", err);
            }
          });
          _context7.next = 20;
          return _sellerModel["default"].findById(id);
        case 20:
          userInfo = _context7.sent;
          return _context7.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Image téléversée avec succès",
            userInfo: userInfo
          }));
        case 24:
          _context7.prev = 24;
          _context7.t0 = _context7["catch"](0);
          //console.error("Erreur lors du téléversement de l'image :", error.message);
          (0, _response.responseReturn)(res, 500, {
            error: "Erreur serveur"
          });
        case 27:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 24]]);
  }));
  return function upload_profile_image(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
var profile_info_add = exports.profile_info_add = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var _req$body3, shopName, country, city, address, telephone, id, updatedUser, userInfo;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          // process.stdout.write("profile mise à jour :  \n" + req.body);
          _req$body3 = req.body, shopName = _req$body3.shopName, country = _req$body3.country, city = _req$body3.city, address = _req$body3.address, telephone = _req$body3.telephone;
          _context8.prev = 1;
          id = req.id; // Assurez-vous que l'ID de l'utilisateur est disponible (par exemple via authMiddleware)
          //process.stdout.write(" id profile : " + id + "\n");
          // Mise à jour des informations de profil de l'utilisateur dans la base de données
          _context8.next = 5;
          return _sellerModel["default"].findByIdAndUpdate(id, {
            shopInfo: {
              shopName: shopName,
              country: country,
              city: city,
              address: address,
              telephone: telephone
            }
          });
        case 5:
          updatedUser = _context8.sent;
          if (!updatedUser) {
            (0, _response.responseReturn)(res, 404, {
              error: "Utilisateur introuvable"
            });
          }
          _context8.next = 9;
          return _sellerModel["default"].findById(id);
        case 9:
          userInfo = _context8.sent;
          // Retourner les informations mises à jour de l'utilisateur
          (0, _response.responseReturn)(res, 200, {
            message: "Informations de profil mises à jour avec succès"
          });
          _context8.next = 16;
          break;
        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](1);
          //console.error("Erreur lors de la mise à jour des informations de profil :", error.message );
          (0, _response.responseReturn)(res, 500, {
            error: "Erreur serveur"
          });
        case 16:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[1, 13]]);
  }));
  return function profile_info_add(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();