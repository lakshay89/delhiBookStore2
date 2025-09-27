import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { createOrder, DeleteOrder, getAllOrders, getAllOrdersAdmin, GetOrderById, UpdateCheckout, verifyPayment } from "../controllers/order.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

router.get("/get-all-orders", verifyToken, getAllOrders);
router.get("/get-all-orders-admin", verifyAdmin, getAllOrdersAdmin);
router.get("/get-order-by-id/:id", GetOrderById);
router.post("/create-checkout",verifyToken, createOrder);
router.post("/verify-payment",verifyToken, verifyPayment);
router.put("/update-order/:id",verifyAdmin, UpdateCheckout);
router.delete("/delete-order/:id",verifyAdmin, DeleteOrder);

export default router;