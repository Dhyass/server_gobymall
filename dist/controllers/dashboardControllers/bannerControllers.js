"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update_product_banner = exports.get_product_banners = exports.get_banners = exports.add_banner = void 0;
var _cloudinary = require("cloudinary");
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bannerModel = _interopRequireDefault(require("../../models/bannerModel.js"));
var _productModel = _interopRequireDefault(require("../../models/productModel.js"));
var _response = require("../../utiles/response.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Types = _mongoose["default"].Types;

// Configuration de Cloudinary
_cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Ajouter une bannière
var add_banner = exports.add_banner = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var productId, banner, product, folderPath, uploadResult, bannerImage;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          productId = req.body.productId;
          banner = req.file;
          if (productId) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID du produit requis"
          }));
        case 4:
          if (banner) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "Image de la bannière requise"
          }));
        case 6:
          _context.prev = 6;
          _context.next = 9;
          return _productModel["default"].findOne({
            _id: productId,
            sellerId: req.user.id // Vérifie l'appartenance du produit
          });
        case 9:
          product = _context.sent;
          if (product) {
            _context.next = 12;
            break;
          }
          return _context.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Produit introuvable ou non autorisé"
          }));
        case 12:
          // Téléchargement de l'image sur Cloudinary
          folderPath = "GOBYMALL/".concat(product.shopName.trim().replace(/\s+/g, "_"), "/banners");
          _context.next = 15;
          return _cloudinary.v2.uploader.upload(banner.path, {
            folder: folderPath,
            public_id: "".concat(product.slug, "-").concat(Date.now())
          });
        case 15:
          uploadResult = _context.sent;
          _context.next = 18;
          return _bannerModel["default"].create({
            productId: product._id,
            banner: uploadResult.secure_url,
            link: uploadResult.url
          });
        case 18:
          bannerImage = _context.sent;
          return _context.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Bannière ajoutée avec succès",
            bannerImage: bannerImage
          }));
        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](6);
          console.error("Erreur lors de l'ajout de la bannière :", _context.t0);
          return _context.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur interne du serveur"
          }));
        case 26:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[6, 22]]);
  }));
  return function add_banner(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var update_product_banner = exports.update_product_banner = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var bannerId, bannerImage, banner, product, oldImagePublicId, folderPath, uploadResult, updatedBanner;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          bannerId = req.params.bannerId;
          bannerImage = req.file; // Récupère le fichier téléchargé
          if (bannerImage) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "Aucune image téléchargée"
          }));
        case 4:
          _context2.prev = 4;
          _context2.next = 7;
          return _bannerModel["default"].findById(bannerId);
        case 7:
          banner = _context2.sent;
          if (banner) {
            _context2.next = 10;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Bannière introuvable"
          }));
        case 10:
          _context2.next = 12;
          return _productModel["default"].findOne({
            _id: banner.productId,
            sellerId: req.user.id // Vérifie le vendeur connecté
          });
        case 12:
          product = _context2.sent;
          if (product) {
            _context2.next = 15;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 403, {
            message: "Produit non autorisé pour cet utilisateur."
          }));
        case 15:
          if (!banner.banner) {
            _context2.next = 25;
            break;
          }
          _context2.prev = 16;
          oldImagePublicId = banner.banner.split("/").pop().split(".")[0]; // Extraire l'identifiant public
          _context2.next = 20;
          return _cloudinary.v2.uploader.destroy(oldImagePublicId);
        case 20:
          _context2.next = 25;
          break;
        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](16);
          console.error("Erreur lors de la suppression de l'ancienne image Cloudinary :", _context2.t0);
        case 25:
          // Téléverser la nouvelle image sur Cloudinary
          folderPath = "GOBYMALL/".concat(product.shopName.trim().replace(/\s+/g, "_"), "/banners");
          _context2.next = 28;
          return _cloudinary.v2.uploader.upload(bannerImage.path, {
            folder: folderPath,
            public_id: "".concat(product.slug, "-").concat(Date.now())
          });
        case 28:
          uploadResult = _context2.sent;
          if (!(!uploadResult || !uploadResult.url)) {
            _context2.next = 31;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur lors du téléversement sur Cloudinary."
          }));
        case 31:
          _context2.next = 33;
          return _bannerModel["default"].findByIdAndUpdate(bannerId, {
            banner: uploadResult.secure_url,
            link: uploadResult.url
          }, {
            "new": true
          } // Retourne le document mis à jour
          );
        case 33:
          updatedBanner = _context2.sent;
          if (updatedBanner) {
            _context2.next = 36;
            break;
          }
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Échec de la mise à jour dans MongoDB."
          }));
        case 36:
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: "Bannière mise à jour avec succès.",
            banner: updatedBanner
          }));
        case 39:
          _context2.prev = 39;
          _context2.t1 = _context2["catch"](4);
          console.error("Erreur dans update_product_banner :", _context2.t1);
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur interne du serveur."
          }));
        case 43:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[4, 39], [16, 22]]);
  }));
  return function update_product_banner(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var get_product_banners = exports.get_product_banners = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var productId, banner;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          productId = req.params.productId; // console.log('params ',req.params)
          _context3.prev = 1;
          _context3.next = 4;
          return _bannerModel["default"].findOne({
            productId: productId
          });
        case 4:
          banner = _context3.sent;
          if (banner) {
            _context3.next = 7;
            break;
          }
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "aucun banner trouvé pour ce produit "
          }));
        case 7:
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 200, {
            banner: banner,
            message: "banner trouvé avec succès."
          }));
        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](1);
          console.log('error ', _context3.t0);
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur lors de la recherche du banner ."
          }));
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 10]]);
  }));
  return function get_product_banners(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var get_banners = exports.get_banners = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var banners;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _bannerModel["default"].aggregate([{
            $sample: {
              size: 10
            }
          }]);
        case 3:
          banners = _context4.sent;
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 200, {
            banners: banners
          }));
        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.log('error ', _context4.t0);
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: "Erreur lors de la recherche du banner ."
          }));
        case 11:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return function get_banners(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();