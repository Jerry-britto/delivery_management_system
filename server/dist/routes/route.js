"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deliverypartner_contoller_1 = require("../controllers/deliverypartner.contoller");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
// partners routes
router
    .route("/partners")
    .get(deliverypartner_contoller_1.getPartners)
    .post(deliverypartner_contoller_1.addPartners);
router
    .route("/partners/:id")
    .put(deliverypartner_contoller_1.updatePartner)
    .delete(deliverypartner_contoller_1.deletePartner);
// order routes
router.route("/orders").get(order_controller_1.getOrders);
router.route("/orders/assign").post(order_controller_1.assignOrder);
router.route("/orders/:id/status").put(order_controller_1.updateOrderStatus);
// assignment routes
exports.default = router;
