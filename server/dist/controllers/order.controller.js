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
exports.updateOrderStatus = exports.assignOrder = exports.getOrders = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const Deliverpartners_1 = __importDefault(require("../models/Deliverpartners"));
// get all orders ( /api/orders )
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find();
        if (!orders) {
            res.status(404).json({ message: "No orders found" });
            return;
        }
        res
            .status(200)
            .json({ message: "Orders retrieved successfully", orders });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "could not retrieve orders", error: error.message });
    }
});
exports.getOrders = getOrders;
// assign order ( /api/orders/assign )
const assignOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderNumber, customerName, custonerPhone, customerAddress, area, items, status, scheduledFor, totalAmount, assignedTo = "", } = req.body;
        if (!orderNumber ||
            !customerName ||
            !custonerPhone ||
            !customerAddress ||
            !area ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !status ||
            !scheduledFor ||
            totalAmount === null) {
            res.status(404).json({ message: "no data found" });
            return;
        }
        const isOrderExists = yield Order_1.default.findOne({ orderNumber });
        if (isOrderExists) {
            console.log("order exists");
            console.log(isOrderExists);
            res
                .status(400)
                .json({ message: "Order with the given order number exists" });
            return;
        }
        console.log("partner -", mongoose_1.default.isValidObjectId(assignedTo));
        if (assignedTo && !mongoose_1.default.isValidObjectId(assignedTo)) {
            res.status(400).json({ message: "Incorrect partner ID, please check it again" });
            return;
        }
        const partner = yield Deliverpartners_1.default.findById(assignedTo);
        if (assignedTo !== "" && !partner) {
            res.status(404).json({ message: "partner with the given id does not exist" });
            return;
        }
        if (partner.currentLoad >= 3) {
            res.status(400).json({ messge: "delivery partner cannot be selected do check another partner" });
            return;
        }
        partner.currentLoad += 1;
        yield partner.save();
        const newOrder = yield Order_1.default.create({
            orderNumber,
            customer: {
                name: customerName,
                address: customerAddress,
                phone: custonerPhone,
            },
            area,
            items,
            status,
            scheduledFor,
            assignedTo: !assignedTo ? null : assignedTo.toString(),
            totalAmount,
        });
        const order = yield Order_1.default.findById(newOrder._id);
        if (!order) {
            res.status(500).json({ message: "could not add an order" });
            return;
        }
        res.status(200).json({ message: "Order added successfully", order });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "could not add order", error: error.message });
    }
});
exports.assignOrder = assignOrder;
// update order status ( /api/orders/id/status )
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || !status) {
            res
                .status(400)
                .json({ message: "kindly provide the required details" });
            return;
        }
        const order = yield Order_1.default.findById(id);
        if (!order) {
            res
                .status(404)
                .json({ message: "No order found with respect to the given order id" });
            return;
        }
        order.status = status;
        yield order.save();
        res.status(200).json({ message: "Updated order status" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "could not assign orders", error: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
