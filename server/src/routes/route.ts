import { Router } from "express";
import {
  addPartners,
  deletePartner,
  getPartners,
  updatePartner,
} from "../controllers/deliverypartner.contoller.ts";
import { assignOrder, getOrders, updateOrderStatus } from "../controllers/order.controller.ts";

const router = Router();

// partners routes
router
.route("/partners")
.get(getPartners)
.post(addPartners);

router
.route("/partners/:id")
.put(updatePartner)
.delete(deletePartner);

// order routes
router.route("/orders").get(getOrders)

router.route("/orders/assign").post(assignOrder);

router.route("/orders/:id/status").put(updateOrderStatus);

// assignment routes

export default router;
