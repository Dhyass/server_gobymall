

/**
 * ADMIN – Approuver une demande d'abonnement
 */

import sellerModel from "../../models/sellerModel.js";
import Subscription from "../../models/subscriptionModel.js";
import { PLAN_CONFIG } from "../../utiles/planConfig.js";


/**
 * ADMIN – Approuver une demande d'abonnement
 */
export const approveSellerSubscription = async (req, res) => {
  const session = await Subscription.startSession();
  session.startTransaction();

  try {
    const { subscriptionId } = req.body;

    console.log("body ", req.body)

    if (!subscriptionId) throw new Error("ID de la demande manquant");

    // Récupérer la demande d’abonnement
    const sellerSubscription = await Subscription.findById(subscriptionId)
      .session(session);

      //console.log("sellerSubscription", sellerSubscription)


    if (!sellerSubscription) throw new Error("Demande introuvable");

    if (sellerSubscription.status !== "pending")
      throw new Error("Cette demande n'est pas en attente");

    // Récupérer le vendeur
    const seller = await sellerModel.findById(sellerSubscription.sellerId)
      .session(session);

    if (!seller) throw new Error("Vendeur introuvable");

    const planConfig = PLAN_CONFIG[sellerSubscription.plan];

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + planConfig.durationMonths);

    // Désactiver tout abonnement actif existant
    await Subscription.updateMany(
      { sellerId: seller._id, status: "active" },
      { status: "expired" },
      { session }
    );

    // Activer cette subscription
    sellerSubscription.status = "active";
    sellerSubscription.startDate = startDate;
    sellerSubscription.endDate = endDate;
    sellerSubscription.payment.method = "none";

    await sellerSubscription.save({ session });

    // Snapshot sur le vendeur
    seller.subscription = {
      plan: sellerSubscription.plan,
      startDate,
      endDate,
      isActive: true,
      subscriptionId: sellerSubscription._id,
    };

    seller.features = planConfig.features;
    seller.commission = {
      type: "percentage",
      value: planConfig.commission,
    };

    await seller.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.json({ success: true, message: "Abonnement approuvé" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ success: false, message: error.message });
  }
};


/**
 * ADMIN – Rejeter une demande d'abonnement
 */
export const rejectSellerSubscription = async (req, res) => {
  try {
    const { subscriptionId, note } = req.body;

    console.log("req body", req.body)

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) throw new Error("Demande introuvable");

    if (subscription.status !== "pending")
      throw new Error("Cette demande n'est plus modifiable");

    subscription.status = "failed";
    subscription.note = note || "Demande rejetée par l'administration";

    await subscription.save();

    return res.json({ success: true, message: "Demande rejetée" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


/*
export const approveSellerSubscription = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sellerId } = req.body;

   // console.log('Seller Id', sellerId)

    const seller = await sellerModel.findById(sellerId).session(session);

   // console.log("seller ", seller)

    if (!seller) {
      throw new Error("Vendeur introuvable");
    }

    const request = seller.subscriptionRequest;

    if (!request || request.status !== "pending") {
      throw new Error("Aucune demande d'abonnement en attente");
    }

 if (
  seller.subscription?.isActive &&
  seller.subscription.plan !== "BASIC"
) {
  throw new Error("Le vendeur possède déjà un abonnement payant actif");
}

    const plan = request.plan;
    const planConfig = PLAN_CONFIG[plan];

   // console.log("plan  ", plan )

    if (!planConfig) {
      throw new Error("Plan invalide");
    }

    /// Dates 
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + planConfig.durationMonths);

    // 1️⃣ Créer Subscription (historique + facturation) 
    const subscription = await Subscription.create(
      [
        {
          sellerId: seller._id,
          plan,
          amount: planConfig.amount,
          currency: "XOF",
          startDate,
          endDate,
          status: "active",
          payment: {
            method: "none",
          },
          features: planConfig.features,
          createdBy: "admin",
        },
      ],
      { session }
    );


   // console.log("subscription", subscription)

    /// 2️⃣ Mettre à jour seller 
    seller.subscription = {
      plan,
      startDate,
      endDate,
      isActive: true,
      subscriptionId: subscription[0]._id,
    };

    seller.features = planConfig.features;

    seller.commission = {
      type: "percentage",
      value: planConfig.commission,
    };

    seller.subscriptionRequest.status = "approved";
    seller.subscriptionRequest.approvedAt = new Date();

    await seller.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: `Plan ${plan} activé avec succès`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      success: false,
      message: error.message || "Erreur activation abonnement",
    });
  }
};
*/

/*
export const rejectSellerSubscription = async (req, res) => {
  try {
    const { sellerId, reason } = req.body;

    const seller = await sellerModel.findById(sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Vendeur introuvable",
      });
    }

    if (!seller.subscriptionRequest || seller.subscriptionRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Aucune demande à rejeter",
      });
    }

    seller.subscriptionRequest.status = "rejected";
    seller.subscriptionRequest.rejectionReason = reason || "Non spécifié";
    seller.subscriptionRequest.rejectedAt = new Date();

    await seller.save();



    return res.json({
      success: true,
      message: "Demande d'abonnement rejetée",
    });
  } catch (error) {
    console.error("rejectSellerSubscription error:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors du rejet",
    });
  }
};
*/