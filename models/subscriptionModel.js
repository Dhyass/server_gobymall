import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema(
  {
    /** 🔗 Lien vendeur */
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "sellers",
      required: true,
      index: true,
    },

    /** 📦 PLAN */
    plan: {
      type: String,
      enum: ["BASIC", "PRO", "BUSINESS"],
      required: true,
    },

    /** 💰 TARIFICATION */
    amount: {
      type: Number,
      required: true, // 0 pour BASIC
    },
    currency: {
      type: String,
      default: "XOF", // FCFA
    },

    /** ⏳ DURÉE */
    duration: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },

    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
      index: true,
    },

    /** 🔄 RENOUVELLEMENT */
    autoRenew: {
      type: Boolean,
      default: false,
    },

    /** 📌 STATUT */
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled", "failed"],
      default: "pending",
      index: true,
    },

    /** 💳 PAIEMENT (PRÉPARÉ POUR PLUS TARD) */
    payment: {
      method: {
        type: String,
        enum: ["mobile_money", "card", "cash", "none"],
        default: "none",
      },

      provider: {
        type: String,
        enum: ["mtn", "moov", "orange", "visa", "mastercard", "stripe", "paystack", "flutterwave"],
      },

      transactionId: String,
      paidAt: Date,
    },

    /** 📊 SNAPSHOT DES FEATURES (TRÈS IMPORTANT) */
    features: {
      maxProducts: Number,
      priorityVisibility: Boolean,
      verifiedBadge: Boolean,
      advancedStats: Boolean,
      promotionAccess: Boolean,
    },

    /** 🧾 MÉTA */
    note: String,
    createdBy: {
      type: String,
      default: "system",
    },
  },
  { timestamps: true }
);

/** 🔐 Index: 1 abonnement actif max par vendeur */
subscriptionSchema.index(
  { sellerId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active" },
  }
);

const Subscription = model("subscriptions", subscriptionSchema);
export default Subscription;
