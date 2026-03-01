
export const PLAN_CONFIG = {
  BASIC: {
    amount: 0,
    durationMonths: 1,
    features: {
      maxProducts: 10,
      priorityVisibility: false,
      verifiedBadge: false,
      advancedStats: false,
      promotionAccess: false,
    },
    commission: 8, // commission plus élevée pour les gratuits
  },

  PRO: {
    amount: 10000,
    durationMonths: 1,
    features: {
      maxProducts: 50,
      priorityVisibility: true,
      verifiedBadge: true,
      advancedStats: false,
      promotionAccess: false,
    },
    commission: 5,
  },

  BUSINESS: {
    amount: 25000,
    durationMonths: 1,
    features: {
      maxProducts: 999999,
      priorityVisibility: true,
      verifiedBadge: true,
      advancedStats: true,
      promotionAccess: true,
    },
    commission: 3,
  },
};


export const BASIC_FEATURES = PLAN_CONFIG.BASIC.features;





/*
export const PLAN_CONFIG = {
  BASIC: {
    name: "Basic",
    price: 0, // gratuit
    durationInDays: 30,
    features: [
      "Publier jusqu’à 20 produits",
      "Accès au tableau de bord vendeur",
      "Gestion de commandes basique",
    ],
    productLimit: 20,
    supportLevel: "standard",
  },

  PRO: {
    name: "Pro",
    price: 5000,
    durationInDays: 30,
    features: [
      "Publier jusqu’à 200 produits",
      "Statistiques avancées",
      "Support prioritaire",
      "Gestion des variantes illimitée",
    ],
    productLimit: 200,
    supportLevel: "priority",
  },

  PREMIUM: {
    name: "Premium",
    price: 15000,
    durationInDays: 30,
    features: [
      "Produits illimités",
      "Boost de visibilité",
      "Support VIP 24/7",
      "Page boutique personnalisée",
    ],
    productLimit: Infinity,
    supportLevel: "vip",
  },
};
*/