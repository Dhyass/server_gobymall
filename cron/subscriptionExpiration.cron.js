import cron from "node-cron";
import sellerModel from "../models/sellerModel.js";
import Subscription from "../models/subscriptionModel.js";
import { BASIC_FEATURES } from "../utiles/planConfig.js";


/**
 * ⏰ CRON : expiration automatique des abonnements
 * 🕛 Tous les jours à 00h05
 */


const subscriptionExpirationJob = () => {
  cron.schedule("5 0 * * *", async () => {
    console.log("🔄 Vérification des abonnements expirés...");

    try {
      const now = new Date();

      const expired = await Subscription.find({
        status: "active",
        endDate: { $lt: now },
      });

      for (const sub of expired) {
        sub.status = "expired";
        await sub.save();

        await sellerModel.findByIdAndUpdate(sub.sellerId, {
          subscription: {
            plan: "BASIC",
            isActive: false,
            startDate: null,
            endDate: sub.endDate,
            subscriptionId: null,
          },
          features: BASIC_FEATURES,
          commission: { type: "percentage", value: 8 },
        });

        console.log(`⛔ Abonnement expiré : seller=${sub.sellerId}`);
      }
    } catch (err) {
      console.error("❌ CRON error:", err);
    }
  });
};

export default subscriptionExpirationJob;


/*

const subscriptionExpirationJob = () => {
  cron.schedule("5 0 * * *", async () => {
    console.log("🔄 Vérification des abonnements expirés...");

    const now = new Date();

    try {
      /// 1️⃣ Récupérer les abonnements expirés 
      const expiredSubscriptions = await Subscription.find({
        status: "active",
        endDate: { $lte: now },
      }).select("_id sellerId plan endDate");

      if (!expiredSubscriptions.length) {
        console.log("✅ Aucun abonnement expiré");
        return;
      }

      const sellerIds = expiredSubscriptions.map(sub => sub.sellerId);

      // 2️⃣ Expirer tous les abonnements d’un coup 
      await Subscription.updateMany(
        { _id: { $in: expiredSubscriptions.map(s => s._id) } },
        { $set: { status: "expired" } }
      );

      // 3️⃣ Rebasculer les vendeurs vers BASIC 
      await sellerModel.updateMany(
        { _id: { $in: sellerIds } },
        {
          $set: {
            "subscription.plan": "BASIC",
            "subscription.isActive": false,

            features: {
              maxProducts: 3,
              priorityVisibility: false,
              verifiedBadge: false,
              advancedStats: false,
              promotionAccess: false,
            },

            commission: {
              type: "percentage",
              value: 8,
            },
          },
        }
      );

      console.log(
        `⛔ ${expiredSubscriptions.length} abonnement(s) expiré(s)`
      );
    } catch (error) {
      console.error("❌ Erreur CRON abonnement:", error);
    }
  });
};

export default subscriptionExpirationJob;
*/
/*
const subscriptionExpirationJob = () => {
  cron.schedule("5 0 * * *", async () => {
    console.log("🔄 Vérification des abonnements expirés...");

    try {
      const now = new Date();

      // 1️⃣ Abonnements actifs expirés 
      const expiredSubscriptions = await Subscription.find({
        status: "active",
        endDate: { $lt: now },
      });

      if (!expiredSubscriptions.length) {
        console.log("✅ Aucun abonnement expiré");
        return;
      }

      for (const sub of expiredSubscriptions) {
        // 2️⃣ Marquer l’abonnement comme expiré 
        sub.status = "expired";
        await sub.save();

        //** 3️⃣ Mettre à jour le vendeur 
        await sellerModel.findByIdAndUpdate(sub.sellerId, {
          $set: {
            "subscription.plan": "BASIC",
            "subscription.isActive": false,
            "subscription.endDate": sub.endDate,

            features: {
              maxProducts: 3,
              priorityVisibility: false,
              verifiedBadge: false,
              advancedStats: false,
              promotionAccess: false,
            },

            commission: {
              type: "percentage",
              value: 8,
            },
          },
        });

        console.log(
          `⛔ Abonnement expiré | sellerId=${sub.sellerId} | plan=${sub.plan}`
        );
      }
    } catch (error) {
      console.error("❌ Erreur CRON abonnement:", error);
    }
  });
};

export default subscriptionExpirationJob;
*/

/** 
 *AMÉLIORATIONS FUTURES (FACULTATIF)

📧 Email automatique “abonnement expiré”

🔔 Notification dashboard vendeur

🔁 Renouvellement automatique

⏳ Grace period (3–7 jours) 
 */
