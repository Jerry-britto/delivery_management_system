import AssignmentModel from "../models/Assignment";
import { Request, Response } from "express";
import OrderModel from "../models/Order";
import DeliveryPartnerModel from "../models/Deliverpartners";
import mongoose from "mongoose";

export const getAssignemnts = async (req: Request, res: Response) => {
  try {
    const assignments = await AssignmentModel.find();
    if (!assignments || assignments.length === 0) {
      console.log("no assignments available");

      res.status(200).json({ message: "no assignments alloted" });
      return;
    }
    res
      .status(200)
      .json({ message: "Assignments retrieved successfully", assignments });
  } catch (error: any) {
    console.log("failed to retrieve assignments ", error);
    res.status(500).json({
      message: "coudld not retrieve assignments",
      error: error.message,
    });
  }
};

export const addAssignment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId, partnerId, status, reason } = req.body;

    // Validate required fields
    if ([orderId, partnerId, status].some((ele) => !ele?.trim())) {
      res
        .status(400)
        .json({ message: "Kindly provide all the necessary inputs" });
      return;
    }

    // Validate status-specific fields
    if (status === "failure" && !reason?.trim()) {
      res
        .status(400)
        .json({ message: "Kindly provide the reason for the failed order" });
      return;
    }

    // Validate ObjectIds
    if (!mongoose.isValidObjectId(orderId)) {
      res.status(400).json({ message: "Invalid Order ID" });
      return;
    }
    if (!mongoose.isValidObjectId(partnerId)) {
      res.status(400).json({ message: "Invalid Partner ID" });
      return;
    }

    // Check if the order is already assigned
    const existingAssignment = await AssignmentModel.findOne({
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
    const [order, partner] = await Promise.all([
      OrderModel.findById(orderId),
      DeliveryPartnerModel.findById(partnerId),
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
    const assignmentData = {
      orderId,
      partnerId,
      status,
      ...(reason && { reason }),
    };
    const assignment = await AssignmentModel.create(assignmentData);

    // Return success response
    res
      .status(200)
      .json({ message: "Assignment added successfully", assignment });
  } catch (error: any) {
    console.error("Could not add assignment due to:", error);
    res.status(500).json({
      message: "Error occurred while adding the assignment",
      error: error.message,
    });
  }
};

export const assignPartnersForPendingOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const MAX_ORDERS_PER_PARTNER = 3; // Maximum capacity per partner

    // Fetch pending orders and active partners
    const [orders, partners] = await Promise.all([
      OrderModel.find({ status: "pending" }),
      DeliveryPartnerModel.find({ status: "active", currentLoad: { $lt: 3 } }),
    ]);

    // Check for no pending orders
    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No pending orders exist" });
      return
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
          await Promise.all([order.save(), partner.save()]);

          console.log(
            `Assigned order ${order.orderNumber} to partner ${partner._id}`
          );

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
  } catch (error: any) {
    console.error("Could not assign partners due to:", error.message);
    res.status(500).json({
      message: "Cannot assign partners to pending orders",
      error: error.message,
    });
  }
};
