"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sumAmount = exports.send_withdrawal_request = exports.get_withdrawal_request = exports.get_seller_payment_details = exports.create_stripe_connect_account = exports.confirm_withdrawal_request = exports.active_stripe_connect_account = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _stripe = _interopRequireDefault(require("stripe"));
var _uuid = require("uuid");
var _sellerModel = _interopRequireDefault(require("../../models/sellerModel.js"));
var _sellerWalletModel = _interopRequireDefault(require("../../models/sellerWalletModel.js"));
var _stripeModel = _interopRequireDefault(require("../../models/stripeModel.js"));
var _withdrawRequestModel = _interopRequireDefault(require("../../models/withdrawRequestModel.js"));
var _response = require("../../utiles/response.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } // Assure-toi que tu utilises une version compatible ES Modules.
var stripe = new _stripe["default"](process.env.STRIPE_SECRET_KEY); // Utilise la clé depuis l'environnement.

var create_stripe_connect_account = exports.create_stripe_connect_account = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var id, uid, stripeInfo, account, accountLink, _account, _accountLink;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          //console.log('create_stripe_connect_account')
          //console.log('req id', req.id)
          id = req.id;
          uid = (0, _uuid.v4)();
          _context.prev = 2;
          _context.next = 5;
          return _stripeModel["default"].findOne({
            sellerId: id
          });
        case 5:
          stripeInfo = _context.sent;
          if (!stripeInfo) {
            _context.next = 21;
            break;
          }
          _context.next = 9;
          return stripeInfo.deleteOne({
            sellerId: id
          });
        case 9:
          _context.next = 11;
          return stripe.accounts.create({
            type: 'express'
          });
        case 11:
          account = _context.sent;
          _context.next = 14;
          return stripe.accountLinks.create({
            account: account.id,
            // Identifiant du compte Stripe
            refresh_url: "".concat(process.env.CLIENT_URL, "/refresh"),
            // URL pour recharger en cas d'échec
            return_url: "".concat(process.env.CLIENT_URL, "/success?activeCode=").concat(uid),
            // URL de retour après validation
            type: 'account_onboarding' // Type de lien (nécessaire pour Stripe)
          });
        case 14:
          accountLink = _context.sent;
          _context.next = 17;
          return _stripeModel["default"].create({
            sellerId: id,
            stripeId: account.id,
            code: uid
          });
        case 17:
          console.log('accountLink ', accountLink);
          return _context.abrupt("return", (0, _response.responseReturn)(res, 201, {
            url: accountLink
          }));
        case 21:
          _context.next = 23;
          return stripe.accounts.create({
            type: 'express'
          });
        case 23:
          _account = _context.sent;
          _context.next = 26;
          return stripe.accountLinks.create({
            account: _account.id,
            // Identifiant du compte Stripe
            refresh_url: "".concat(process.env.CLIENT_URL, "/refresh"),
            // URL pour recharger en cas d'échec
            return_url: "".concat(process.env.CLIENT_URL, "/success?activeCode=").concat(uid),
            // URL de retour après validation
            type: 'account_onboarding' // Type de lien (nécessaire pour Stripe)
          });
        case 26:
          _accountLink = _context.sent;
          _context.next = 29;
          return _stripeModel["default"].create({
            sellerId: id,
            stripeId: _account.id,
            code: uid
          });
        case 29:
          return _context.abrupt("return", (0, _response.responseReturn)(res, 200, {
            url: _accountLink
          }));
        case 30:
          _context.next = 36;
          break;
        case 32:
          _context.prev = 32;
          _context.t0 = _context["catch"](2);
          console.log('internal error ', _context.t0.message);
          (0, _response.responseReturn)(res, 500, {
            message: 'internal error'
          });
        case 36:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[2, 32]]);
  }));
  return function create_stripe_connect_account(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/*
export const create_stripe_connect_account  = async (req, res) => {
  const { id } = req; // ID du vendeur
  const uid = uuidv4(); // Code d'activation unique

  try {
    let stripeInfo = await stripeModel.findOne({ sellerId: id });

    // Si un compte Stripe existe déjà
    if (stripeInfo) {
      const account = await stripe.accounts.retrieve(stripeInfo.stripeId);

      // Si le compte n'est pas encore activé
      if (!account.charges_enabled || !account.payouts_enabled || account.requirements.pending_verification.length > 0) {
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.CLIENT_URL}/refresh`,
          return_url: `${process.env.CLIENT_URL}/success?activeCode=${stripeInfo.code}`,
          type: 'account_onboarding',
        });

        return responseReturn(res, 200, { url: accountLink });
      }

      // Le compte est déjà activé
      return responseReturn(res, 200, {
        message: "Compte Stripe déjà activé pour ce vendeur.",
        stripeId: stripeInfo.stripeId,
      });
    }

    // Aucun compte Stripe trouvé : on crée un nouveau compte
    const account = await stripe.accounts.create({ type: 'express' });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.CLIENT_URL}/refresh`,
      return_url: `${process.env.CLIENT_URL}/success?activeCode=${uid}`,
      type: 'account_onboarding',
    });

    // Enregistrer les infos du compte Stripe dans la base de données
    await stripeModel.create({
      sellerId: id,
      stripeId: account.id,
      code: uid,
    });

    return responseReturn(res, 201, { url: accountLink });
  } catch (error) {
    console.error('Erreur Stripe :', error.message);
    return responseReturn(res, 500, { message: 'Erreur interne Stripe' });
  }
};
*/

/*
export const create_stripe_connect_account = async (req, res) => {
  const { id } = req; // ID du vendeur
  const uid = uuidv4(); // Code d'activation unique

  try {
    let stripeInfo = await stripeModel.findOne({ sellerId: id });

    if (stripeInfo) {
      const account = await stripe.accounts.retrieve(stripeInfo.stripeId);

      // Vérifiez si des actions supplémentaires sont requises
      if (
        !account.charges_enabled ||
        !account.payouts_enabled ||
        account.requirements.pending_verification.length > 0
      ) {
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.CLIENT_URL}/refresh`,
          return_url: `${process.env.CLIENT_URL}/success?activeCode=${stripeInfo.code}`,
          type: "account_onboarding",
        });

        return responseReturn(res, 200, {
          message: "Actions supplémentaires requises pour activer le compte.",
          url: accountLink.url, // Redirige le vendeur vers le lien d'onboarding
        });
      }

      // Le compte est déjà activé
      return responseReturn(res, 200, {
        message: "Compte Stripe déjà activé pour ce vendeur.",
        stripeId: stripeInfo.stripeId,
      });
    }

    // Aucun compte Stripe trouvé : on crée un nouveau compte
    const account = await stripe.accounts.create({ type: "express" });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.CLIENT_URL}/refresh`,
      return_url: `${process.env.CLIENT_URL}/success?activeCode=${uid}`,
      type: "account_onboarding",
    });

    // Enregistrer les infos du compte Stripe dans la base de données
    await stripeModel.create({
      sellerId: id,
      stripeId: account.id,
      code: uid,
    });

    return responseReturn(res, 201, { url: accountLink.url });
  } catch (error) {
    console.error("Erreur Stripe :", error.message);
    return responseReturn(res, 500, { message: "Erreur interne Stripe" });
  }
};
*/

var active_stripe_connect_account = exports.active_stripe_connect_account = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var activeCode, id, userStripeInfo;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          //console.log(' req params ', req.params)
          activeCode = req.params.activeCode;
          id = req.id;
          _context2.prev = 2;
          _context2.next = 5;
          return _stripeModel["default"].findOne({
            code: activeCode
          });
        case 5:
          userStripeInfo = _context2.sent;
          if (!userStripeInfo) {
            _context2.next = 12;
            break;
          }
          _context2.next = 9;
          return _sellerModel["default"].findByIdAndUpdate(id, {
            payment: 'active'
          });
        case 9:
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 200, {
            message: 'stripe account active'
          }));
        case 12:
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: 'stripe account not found'
          }));
        case 13:
          _context2.next = 19;
          break;
        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](2);
          console.log('internal error ', _context2.t0.message);
          return _context2.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: 'internal error'
          }));
        case 19:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[2, 15]]);
  }));
  return function active_stripe_connect_account(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
/*
export const sumAmount = (data)=>{
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].amount;
  }
  return sum;
}

export const get_seller_payment_details = async(req,res) =>{
  ///console.log(' req params ', req.params)
  const {sellerId} = req.params
  try {
    /*const amount = await sellerWalletModel.aggregate([
      {
        $match: {
          sellerId: {
            $eq: sellerId
          }
        }
      },

      {
        $group : {
          _id : null,
          totalAmount : {$sum : '$amount'}
        }
      }
    ])
   const payments = await sellerWalletModel.find({sellerId : sellerId})
    console.log(' payments ', payments)

    const pendingWithdraws = await withdrawRequestModel.find({
      $and:[
        {
          sellerId :{
            $eq : sellerId
          }
        },
        {
          status : {
            $eq : 'pending'
          }
        }
      ]
    })


    const successWithdraws = await withdrawRequestModel.find({
      $and:[
        {
          sellerId :{
            $eq : sellerId
          }
        },
        {
          status : {
            $eq : 'success'
          }
        }
      ]
    })

    const pendingAmount = this.sumAmount(pendingWithdraws)
    const successAmount = this.sumAmount(successWithdraws)
    const totalAmount = this.sumAmount(payments)

    let availableAmount = 0;

    if (totalAmount) {
      availableAmount = totalAmount-(pendingAmount-successAmount)
    }
    console.log('availableAmount', availableAmount)

    return responseReturn(res,200,{
      totalAmount : totalAmount,
      pendingAmount : pendingAmount,
      withdrawalAmount : successAmount,
      availableAmount : availableAmount,
      successWithdraws : successWithdraws,
      pendingWithdraws : pendingWithdraws
    })
  } catch (error) {
    console.log('internal error ', error.message)
   return responseReturn(res, 500, {message : 'internal error'})
  }
}*/

var sumAmount = exports.sumAmount = function sumAmount(data) {
  return data.reduce(function (sum, item) {
    return sum + (item.amount || 0);
  }, 0);
};
var get_seller_payment_details = exports.get_seller_payment_details = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var sellerId, payments, pendingWithdraws, successWithdraws, pendingAmount, successAmount, totalAmount, availableAmount;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          sellerId = req.params.sellerId;
          _context3.prev = 1;
          _context3.next = 4;
          return _sellerWalletModel["default"].find({
            sellerId: sellerId
          });
        case 4:
          payments = _context3.sent;
          _context3.next = 7;
          return _withdrawRequestModel["default"].find({
            sellerId: sellerId,
            status: 'pending'
          });
        case 7:
          pendingWithdraws = _context3.sent;
          _context3.next = 10;
          return _withdrawRequestModel["default"].find({
            sellerId: sellerId,
            status: 'success'
          });
        case 10:
          successWithdraws = _context3.sent;
          // Calcul des montants
          pendingAmount = sumAmount(pendingWithdraws);
          successAmount = sumAmount(successWithdraws);
          totalAmount = sumAmount(payments);
          availableAmount = 0;
          if (totalAmount > 0) {
            availableAmount = totalAmount - (pendingAmount + successAmount);
            // console.log('available Amount', availableAmount)
          }

          //  console.log('Available Amount:', availableAmount);
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 200, {
            totalAmount: totalAmount,
            pendingAmount: pendingAmount,
            withdrawalAmount: successAmount,
            availableAmount: availableAmount,
            successWithdraws: successWithdraws,
            pendingWithdraws: pendingWithdraws
          }));
        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](1);
          console.error('Internal error:', _context3.t0.message);
          return _context3.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: 'Internal error'
          }));
        case 23:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 19]]);
  }));
  return function get_seller_payment_details(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var send_withdrawal_request = exports.send_withdrawal_request = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$body, sellerId, amount, withdrawal;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, sellerId = _req$body.sellerId, amount = _req$body.amount;
          _context4.prev = 1;
          _context4.next = 4;
          return _withdrawRequestModel["default"].create({
            sellerId: sellerId,
            amount: parseInt(amount)
          });
        case 4:
          withdrawal = _context4.sent;
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 200, {
            withdrawal: withdrawal,
            message: 'Withdrawal request sent successfully'
          }));
        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          console.error('Internal error:', _context4.t0.message);
          return _context4.abrupt("return", (0, _response.responseReturn)(res, 500, {
            message: 'Internal error'
          }));
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 8]]);
  }));
  return function send_withdrawal_request(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var get_withdrawal_request = exports.get_withdrawal_request = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var withdrawalRequest;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _withdrawRequestModel["default"].find({
            status: 'pending'
          });
        case 3:
          withdrawalRequest = _context5.sent;
          (0, _response.responseReturn)(res, 200, {
            withdrawalRequest: withdrawalRequest
          });
          _context5.next = 10;
          break;
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          (0, _response.responseReturn)(res, 500, {
            message: 'Internal server error'
          });
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function get_withdrawal_request(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
/*
export const confirm_withdrawal_request= async (req, res) => {
  const { paymentId } = req.body
  console.log('payment id ', paymentId)

        try {
            const payment = await withdrawRequestModel.findById(paymentId)
           // console.log('payment ', payment)
           if (!paymentId || !mongoose.Types.ObjectId.isValid(paymentId)) {
                           return responseReturn(res, 400, { message: "ID invalide" });
                    }
             const paymentObjectId = mongoose.Types.ObjectId.createFromHexString(paymentId);
            const { stripeId } = await stripeModel.findOne({
                sellerId: paymentObjectId
            })

            await stripe.transfers.create({
                amount: payment.amount * 100,
                currency: 'usd',
                destination: stripeId
            })
            await withdrowRequest.findByIdAndUpdate(paymentId, { status: 'success' })
            responseReturn(res, 200, { payment, message: 'request confirm success' })
        } catch (error) {
            console.log(error)
            responseReturn(res, 500, { message: 'Internal server error' })
        }

}*/

var confirm_withdrawal_request = exports.confirm_withdrawal_request = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var paymentId, payment, sellerId, stripeData, stripeId;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          paymentId = req.body.paymentId;
          console.log('payment id ', paymentId);

          // Vérifiez si l'ID est valide
          if (!(!paymentId || !_mongoose["default"].Types.ObjectId.isValid(paymentId))) {
            _context6.next = 4;
            break;
          }
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID de paiement invalide"
          }));
        case 4:
          _context6.prev = 4;
          _context6.next = 7;
          return _withdrawRequestModel["default"].findById(paymentId);
        case 7:
          payment = _context6.sent;
          if (payment) {
            _context6.next = 10;
            break;
          }
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Demande de retrait introuvable"
          }));
        case 10:
          // console.log('payment ', payment)
          // Récupérez le sellerId depuis la demande de retrait
          sellerId = payment.sellerId;
          console.log('sellerId ', sellerId);
          if (sellerId) {
            _context6.next = 14;
            break;
          }
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 400, {
            message: "ID du vendeur introuvable dans la demande de retrait"
          }));
        case 14:
          _context6.next = 16;
          return _stripeModel["default"].findOne({
            sellerId: new _mongoose["default"].Types.ObjectId(sellerId)
          });
        case 16:
          stripeData = _context6.sent;
          if (!(!stripeData || !stripeData.stripeId)) {
            _context6.next = 19;
            break;
          }
          return _context6.abrupt("return", (0, _response.responseReturn)(res, 404, {
            message: "Aucun compte Stripe associé trouvé pour ce vendeur"
          }));
        case 19:
          stripeId = stripeData.stripeId;
          console.log('stripeId ', stripeId);
          console.log('payment.amount ', payment.amount);

          // Créez le transfert Stripe
          _context6.next = 24;
          return stripe.transfers.create({
            amount: payment.amount * 100,
            // Assurez-vous que payment.amount est un nombre
            currency: 'usd',
            destination: stripeId
          });
        case 24:
          _context6.next = 26;
          return _withdrawRequestModel["default"].findByIdAndUpdate(paymentId, {
            status: 'success'
          });
        case 26:
          (0, _response.responseReturn)(res, 200, {
            payment: payment,
            message: 'Demande de retrait confirmée avec succès'
          });
          _context6.next = 33;
          break;
        case 29:
          _context6.prev = 29;
          _context6.t0 = _context6["catch"](4);
          console.error(_context6.t0);
          (0, _response.responseReturn)(res, 500, {
            message: 'Erreur interne du serveur'
          });
        case 33:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[4, 29]]);
  }));
  return function confirm_withdrawal_request(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();