"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const OrderSchema = new mongoose_1.Schema({
    orderNumber: {
        type: String,
        required: true,
    },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    area: {
        type: String,
        required: true,
    },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    status: {
        type: String,
        enum: ["pending", "assigned", "picked", "delivered"],
        default: "pending",
    },
    scheduledFor: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "DeliveryPartner",
        default: null,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const OrderModel = mongoose_1.default.models.Order || mongoose_1.default.model("Order", OrderSchema);
exports.default = OrderModel;