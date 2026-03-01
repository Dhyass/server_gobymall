import sellerModel from "../models/sellerModel.js";

/**
 * Middleware générique de vérification du plan vendeur
 *
 * @param {Object} options
 * @param {Number} options.maxProducts - limite de produits
 * @param {Boolean} options.promotionAccess - accès aux promotions
 * @param {Boolean} options.advancedStats - accès stats avancées
 */
const checkSellerPlan = (options = {}) => {
  return async (req, res, next) => {
    try {
      const sellerId = req.user?.id || req.user?._id;

      if (!sellerId) {
        return res.status(401).json({
          success: false,
          message: "Vendeur non authentifié",
        });
      }

      const seller = await sellerModel.findById(sellerId);

      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "Vendeur introuvable",
        });
      }

      /** 🔒 Vérifier abonnement actif */
      if (!seller.subscription?.isActive) {
        return res.status(403).json({
          success: false,
          message: "Aucun abonnement actif",
        });
      }

      /** ⏳ Vérifier expiration */
      if (
        seller.subscription.endDate &&
        new Date(seller.subscription.endDate) < new Date()
      ) {
        return res.status(403).json({
          success: false,
          message: "Abonnement expiré",
        });
      }

      /** 🎯 Vérification des droits */
      const { features } = seller;

      if (
        options.maxProducts !== undefined &&
        features.maxProducts < options.maxProducts
      ) {
        return res.status(403).json({
          success: false,
          message: "Limite de produits atteinte pour votre plan",
        });
      }

      if (
        options.promotionAccess &&
        features.promotionAccess !== true
      ) {
        return res.status(403).json({
          success: false,
          message: "Accès aux promotions réservé aux plans supérieurs",
        });
      }

      if (
        options.advancedStats &&
        features.advancedStats !== true
      ) {
        return res.status(403).json({
          success: false,
          message: "Statistiques avancées non disponibles pour votre plan",
        });
      }

      /** 📌 Injecter le vendeur pour la suite */
      req.seller = seller;

      next();
    } catch (error) {
      console.error("checkSellerPlan error:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification du plan vendeur",
      });
    }
  };
};

export default checkSellerPlan;
