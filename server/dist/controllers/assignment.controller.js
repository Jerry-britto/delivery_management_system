"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignPartnersForPendingOrders = exports.addAssignment = exports.getAssignemnts = void 0;
const Assignment_1 = __importDefault(require("../models/Assignment"));
const Order_1 = __importDefault(require("../models/Order"));
const Deliverpartners_1 = __importDefault(require("../models/Deliverpartners"));
const mongoose_1 = __importDefault(require("mongoose"));
const getAssignemnts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield Assignment_1.default.find();
        if (!assignments || assignments.length === 0) {
            console.log("no assignments available");
            res.status(200).json({ message: "no assignments alloted" });
            return;
        }
        res
            .status(200)
            .json({ message: "Assignments retrieved successfully", assignments });
    }
    catch (error) {
        console.log("failed to retrieve assignments ", error);
        res.status(500).json({
            message: "coudld not retrieve assignments",
            error: error.message,
        });
    }
});
exports.getAssignemnts = getAssignemnts;
const addAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, partnerId, status, reason } = req.body;
        // Validate required fields
        if ([orderId, partnerId, status].some((ele) => !(ele === null || ele === void 0 ? void 0 : ele.trim()))) {
            res
                .status(400)
                .json({ message: "Kindly provide all the necessary inputs" });
            return;
        }
        // Validate status-specific fields
        if (status === "failure" && !(reason === null || reason === void 0 ? void 0 : reason.trim())) {
            res
                .status(400)
                .json({ message: "Kindly provide the reason for the failed order" });
            return;
        }
        // Validate ObjectIds
        if (!mongoose_1.default.isValidObjectId(orderId)) {
            res.status(400).json({ message: "Invalid Order ID" });
            return;
        }
        if (!mongoose_1.default.isValidObjectId(partnerId)) {
            res.status(400).json({ message: "Invalid Partner ID" });
            return;
        }
        // Check if the order is already assigned
        const existingAssignment = yield Assignment_1.default.findOne({
            orderId,
            partnerId,
        });
        if (existingAssignment) {
            res
                .status(409)
                .json({ message: "Order is already assigned to a delivery partner" });
            return;
        }
        // Validate existence of order and partner
        const [order, partner] = yield Promise.all([
            Order_1.default.findById(orderId),
            Deliverpartners_1.default.findById(partnerId),
        ]);
        if (!order) {
            res.status(404).json({ message: "Order does not exist" });
            return;
        }
        if (!partner) {
            res.status(404).json({ message: "Partner does not exist" });
            return;
        }
        // Create and save the assignment
        const assignmentData = Object.assign({ orderId,
            partnerId,
            status }, (reason && { reason }));
        const assignment = yield Assignment_1.default.create(assignmentData);
        // Return success response
        res
            .status(200)
            .json({ message: "Assignment added successfully", assignment });
    }
    catch (error) {
        console.error("Could not add assignment due to:", error);
        res.status(500).json({
            message: "Error occurred while adding the assignment",
            error: error.message,
        });
    }
});
exports.addAssignment = addAssignment;
const assignPartnersForPendingOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MAX_ORDERS_PER_PARTNER = 3; // Maximum capacity per partner
        // Fetch pending orders and active partners
        const [orders, partners] = yield Promise.all([
            Order_1.default.find({ status: "pending" }),
            Deliverpartners_1.default.find({ status: "active", currentLoad: { $lt: 3 } }),
        ]);
        // Check for no pending orders
        if (!orders || orders.length === 0) {
            res.status(404).json({ message: "No pending orders exist" });
            return;
        }
        // Check for no active partners
        if (!partners || partners.length === 0) {
            res.status(404).json({ message: "No active partners exist" });
            return;
        }
        console.log("Active partners:", partners);
        console.log("Pending orders:", orders);
        let partnerIndex = 0; // Start with the first partner
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            let assigned = false;
            // Attempt to find a partner who can take this order
            for (let attempt = 0; attempt < partners.length; attempt++) {
                const partner = partners[partnerIndex];
                if (partner.currentLoad < MAX_ORDERS_PER_PARTNER) {
                    // Assign the partner to the order
                    order.assignedTo = partner._id;
                    order.status = "assigned";
                    // Update partner's load and save both order and partner
                    partner.currentLoad += 1;
                    yield Promise.all([order.save(), partner.save()]);
                    console.log(`Assigned order ${order.orderNumber} to partner ${partner._id}`);
                    assigned = true;
                    break; // Break out of the inner loop once assigned
                }
                // Move to the next partner (round-robin)
                partnerIndex = (partnerIndex + 1) % partners.length;
            }
            // If no partner could take this order
            if (!assigned) {
                console.log(`No available partner for order ${order.orderNumber}`);
            }
        }
        res.status(200).json({
            message: "Partners successfully assigned to pending orders",
        });
    }
    catch (error) {
        console.error("Could not assign partners due to:", error.message);
        res.status(500).json({
            message: "Cannot assign partners to pending orders",
            error: error.message,
        });
    }
});
exports.assignPartnersForPendingOrders = assignPartnersForPendingOrders;
