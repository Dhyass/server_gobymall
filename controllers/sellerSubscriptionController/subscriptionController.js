import Subscription from "../../models/subscriptionModel.js";
import { PLAN_CONFIG } from "../../utiles/planConfig.js";

/*

export const requestSellerSubscription = async (req, res) => {
  try {
    const sellerId = req.id;
    const { plan } = req.body;

    if (!["PRO", "BUSINESS"].includes(plan)) {
      return res.status(400).json({ message: "Plan invalide" });
    }

    const seller = await sellerModel.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    // 1️⃣ Bloquer si une demande est déjà en attente
    if (seller.subscriptionRequest?.status === "pending") {
      return res.status(400).json({
        message: "Une demande est déjà en cours de validation",
      });
    }

    // 2️⃣ Bloquer si un plan est déjà actif
    if (seller.subscription?.plan !== "BASIC") {
      return res.status(400).json({
        message: "Un abonnement est déjà actif",
      });
    }

    // 3️⃣ Créer la demande
    seller.subscriptionRequest = {
      plan,
      status: "pending",
      requestedAt: new Date(),
    };

    await seller.save();

    res.status(200).json({
      message: "Demande envoyée avec succès",
      subscriptionRequest: seller.subscriptionRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
*/


export const requestSellerSubscription = async (req, res) => {
  try {
    const sellerId = req.id; // depuis auth middleware
    const { plan } = req.body;

    console.log("plan", plan)

    // Vérifier si le plan existe
    const planConfig = PLAN_CONFIG[plan];
    if (!planConfig)
      return res.status(400).json({ message: "Plan invalide" });

    // Vérifier qu’il n’y ait pas déjà une demande en cours
    const existingPending = await Subscription.findOne({
      sellerId,
      status: "pending",
    });

    if (existingPending)
      return res.status(400).json({
        message: "Une demande d'abonnement est déjà en attente",
      });

    // Créer une nouvelle demande
    await Subscription.create({
      sellerId,
      plan,
      amount: planConfig.amount,
      currency: "XOF",
      duration: "monthly",
      startDate: null,
      endDate: null,
      status: "pending",
      createdBy: "seller",
      features: planConfig.features,
    });

    return res.json({
      success: true,
      message: "Demande d'abonnement envoyée",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// 📌 GET demandes d’abonnement en attente (status = pending)
export const getSubscriptionRequests = async (req, res) => {
  try {
    const requests = await Subscription.find({ status: "pending" })
      .populate("sellerId", "name email shopName");

      //console.log('requests', requests)

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 GET abonnements actifs
export const getActiveSubscriptions = async (req, res) => {
  try {
    const active = await Subscription.find({ status: "active" })
      .populate("sellerId", "name email shopName");
     //console.log("active ", active)
    res.status(200).json(active);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 GET abonnements expirés
export const getExpiredSubscriptions = async (req, res) => {
  try {
    const expired = await Subscription.find({ status: "expired" })
      .populate("sellerId", "name email shopName");

    res.status(200).json(expired);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 GET abonnements rejetés
export const getRejectedSubscriptions = async (req, res) => {
  try {
    const rejected = await Subscription.find({ status: "failed" })
      .populate("sellerId", "name email shopName");

     // console.log("rejected", rejected)

    res.status(200).json(rejected);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

