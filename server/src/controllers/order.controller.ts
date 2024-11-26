import mongoose from "mongoose";
import OrderModel from "../models/Order";
import { Request, Response } from "express";
import DeliveryPartnerModel from "../models/Deliverpartners";

// get all orders ( /api/orders )
const getOrders = async (req: Request, res: Response):Promise<void> => {
  try {
    const orders = await OrderModel.find();
    if (!orders) {
       res.status(404).json({ message: "No orders found" });
       return
    }
     res
      .status(200)
      .json({ message: "Orders retrieved successfully", orders });
  } catch (error: any) {
     res
      .status(500)
      .json({ message: "could not retrieve orders", error: error.message });
  }
};

// assign order ( /api/orders/assign )
const assignOrder = async (req: Request, res: Response):Promise<void> => {
  try {
    const {
      orderNumber,
      customerName,
      custonerPhone,
      customerAddress,
      area,
      items,
      status,
      scheduledFor,
      totalAmount,
      assignedTo = "",
    } = req.body;

    if (
      !orderNumber ||
      !customerName ||
      !custonerPhone ||
      !customerAddress ||
      !area ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !status ||
      !scheduledFor ||
      totalAmount === null
    ) {
       res.status(404).json({ message: "no data found" });
       return
    }

    const isOrderExists = await OrderModel.findOne({ orderNumber });

    if (isOrderExists) {
      console.log("order exists");
      
      console.log(isOrderExists);
      
       res
        .status(400)
        .json({ message: "Order with the given order number exists" });
        return
    }

    console.log("partner -",mongoose.isValidObjectId(assignedTo));
    
    if (assignedTo && !mongoose.isValidObjectId(assignedTo)) {
       res.status(400).json({ message: "Incorrect partner ID, please check it again" });
        return;
      }

    const partner = await DeliveryPartnerModel.findById(assignedTo);

    if (assignedTo !== "" && !partner) {
      res.status(404).json({message:"partner with the given id does not exist"})
      return;
    }

    if (partner.currentLoad >= 3) {
      res.status(400).json({messge:"delivery partner cannot be selected do check another partner"});
      return;
    }

    partner.currentLoad +=1;

    await partner.save();

    const newOrder = await OrderModel.create({
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
      assignedTo: !assignedTo?null:assignedTo.toString(),
      totalAmount,
    });

    const order = await OrderModel.findById(newOrder._id);

    if (!order) {
       res.status(500).json({ message: "could not add an order" });
       return
    }

     res.status(200).json({ message: "Order added successfully", order });
  } catch (error: any) {
     res
      .status(500)
      .json({ message: "could not add order", error: error.message });
  }
};

// update order status ( /api/orders/id/status )
const updateOrderStatus = async (req: Request, res: Response):Promise<void>=> {
  try {
    const { id } = req.params;
    const { status } = req.body;
console.log(id,status);``

    if (!id || !status) {
       res
        .status(400)
        .json({ message: "kindly provide the required details" });
        return;
    }

    const order = await OrderModel.findById(id);

    if (!order) {
       res
        .status(404)
        .json({ message: "No order found with respect to the given order id" });
        return;
    }

    order.status = status;

    await order.save();

     res.status(200).json({ message: "Updated order status" });
  } catch (error: any) {
     res
      .status(500)
      .json({ message: "could not assign orders", error: error.message });
  }
};

export {getOrders,assignOrder,updateOrderStatus}
