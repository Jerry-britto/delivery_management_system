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
exports.deletePartner = exports.updatePartner = exports.addPartners = exports.getPartners = void 0;
const Deliverpartners_1 = __importDefault(require("../models/Deliverpartners"));
// get partner details ( /api/partners )
const getPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partners = yield Deliverpartners_1.default.find();
        if (!partners || partners.length == 0) {
            res.status(404).json({ message: "No partners found" });
            return;
        }
        res
            .status(200)
            .json({ message: "Partners retrieved successfully.", partners });
    }
    catch (error) {
        res.status(500).json({
            message: "could not retrieve partner details",
            error: error.message,
        });
    }
});
exports.getPartners = getPartners;
// add partner details ( /api/partners )
const addPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, status, currentLoad, areas, start, end, rating, completedOrders, cancelledOrders, } = req.body;
        if (!name ||
            !email ||
            !phone ||
            !status ||
            currentLoad == null ||
            !areas ||
            areas.length === 0 ||
            !start ||
            !end ||
            rating == null ||
            completedOrders == null ||
            cancelledOrders == null) {
            console.log("no info received");
            res
                .status(400)
                .json({ message: "Kindly enter all the required details." });
            return;
        }
        const userExists = yield Deliverpartners_1.default.findOne({ email });
        if (userExists) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        // Create a new delivery partner
        const deliverPartner = yield Deliverpartners_1.default.create({
            name,
            email,
            phone,
            status,
            currentLoad,
            areas,
            shift: {
                start,
                end,
            },
            metrics: {
                rating,
                completedOrders,
                cancelledOrders,
            },
        });
        const doesDeliveryExists = yield Deliverpartners_1.default.findById(deliverPartner._id);
        if (!doesDeliveryExists) {
            console.log("partner not added");
            res.status(500).json({ message: "partner could not added" });
            return;
        }
        res.status(201).json({
            message: "New Delivery Partner added successfully.",
            deliverPartner,
        });
    }
    catch (error) {
        console.log("error", error.message);
        res.status(500).json({
            message: "Could not add partner details.",
            error: error.message,
        });
    }
});
exports.addPartners = addPartners;
// update partner details ( /api/partners/id )
const updatePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        if (!id || Object.keys(updatedData).length === 0) {
            res
                .status(400)
                .json({ message: "Invalid request. Missing required details." });
            return;
        }
        const partner = yield Deliverpartners_1.default.findById(id);
        if (!partner) {
            res
                .status(404)
                .json({ message: "no partner found with the given id" });
            return;
        }
        const updatedPartner = yield Deliverpartners_1.default.findByIdAndUpdate(id, {
            $set: updatedData,
        }, { new: true, runValidators: true });
        res.status(200).json({
            message: "Delivery partner details updated successfully.",
            partner: updatedPartner,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "could not update partner details",
            error: error.message,
        });
    }
});
exports.updatePartner = updatePartner;
// delete partner details ( /api/partners/id )
const deletePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res
                .status(400)
                .json({ message: "Invalid request. Missing Delivery partner's id." });
            return;
        }
        yield Deliverpartners_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Successfully deleted partner" });
    }
    catch (error) {
        res.status(500).json({
            message: "could not delete partner details",
            error: error.message,
        });
    }
});
exports.deletePartner = deletePartner;
