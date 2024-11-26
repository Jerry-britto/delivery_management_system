import { Router } from "express";
import {
  addPartners,
  deletePartner,
  getPartners,
  updatePartner,
} from "../controllers/deliverypartner.contoller";
import { assignOrder, getOrders, updateOrderStatus } from "../controllers/order.controller";
import { addAssignment, assignPartnersForPendingOrders, getAssignemnts } from "../controllers/assignment.controller";

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
router.
route("/assignments")
.get(getAssignemnts)
.post(addAssignment);

router.route("/assignments/run").post(assignPartnersForPendingOrders)

export default router;
