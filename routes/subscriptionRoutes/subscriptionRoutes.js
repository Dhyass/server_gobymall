import express from "express";
import { approveSellerSubscription, rejectSellerSubscription } from "../../controllers/sellerSubscriptionController/adminAprrouveReject.js";
import {
    getActiveSubscriptions,
    getExpiredSubscriptions,
    getRejectedSubscriptions,
    getSubscriptionRequests,
    requestSellerSubscription
} from "../../controllers/sellerSubscriptionController/subscriptionController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/seller/subscription/request", authMiddleware, requestSellerSubscription);

router.post("/admin/subscription/approve",authMiddleware, approveSellerSubscription);

router.post("/admin/subscription/reject",authMiddleware, rejectSellerSubscription)

router.get("/admin/subscriptions/requests", authMiddleware, getSubscriptionRequests)

router.get(`/admin/subscriptions/active`, authMiddleware, getActiveSubscriptions)

router.get(`/admin/subscriptions/rejected`, authMiddleware, getRejectedSubscriptions)

router.get(`/admin/subscriptions/expired`, authMiddleware, getExpiredSubscriptions)


export default router;