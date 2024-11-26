import DeliveryPartnerModel from "../models/Deliverpartners";
import { Request, Response } from "express";

// get partner details ( /api/partners )
const getPartners = async (req: Request, res: Response): Promise<void> => {
  try {
    const partners = await DeliveryPartnerModel.find();
    if (!partners || partners.length == 0) {
      res.status(404).json({ message: "No partners found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Partners retrieved successfully.", partners });
  } catch (error: any) {
    res.status(500).json({
      message: "could not retrieve partner details",
      error: error.message,
    });
  }
};

// add partner details ( /api/partners )
const addPartners = async (req: Request, res: Response):Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      status,
      currentLoad,
      areas,
      start,
      end,
      rating,
      completedOrders,
      cancelledOrders,
    } = req.body;

    if (
      !name ||
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
      cancelledOrders == null
    ) {
      console.log("no info received");
      
       res
        .status(400)
        .json({ message: "Kindly enter all the required details." });
        return
    }

    const userExists = await DeliveryPartnerModel.findOne({email})

    if (userExists) {
      res.status(409).json({message:"User already exists"})
      return
    }

    // Create a new delivery partner
    const deliverPartner = await DeliveryPartnerModel.create({
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

    const doesDeliveryExists = await DeliveryPartnerModel.findById(deliverPartner._id);

    if (!doesDeliveryExists) {
      console.log("partner not added");
      res.status(500).json({message:"partner could not added"})
      return
    }

     res.status(201).json({
      message: "New Delivery Partner added successfully.",
      deliverPartner,
    });
  } catch (error: any) {
    console.log("error",error.message);
    
    res.status(500).json({
      message: "Could not add partner details.",
      error: error.message,
    });
  }
};

// update partner details ( /api/partners/id )
const updatePartner = async (req: Request, res: Response):Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    if (!id || Object.keys(updatedData).length === 0) {
       res
        .status(400)
        .json({ message: "Invalid request. Missing required details." });
        return
    }

    const partner = await DeliveryPartnerModel.findById(id);

    if (!partner) {
       res
        .status(404)
        .json({ message: "no partner found with the given id" });
        return;
    }

    const updatedPartner = await DeliveryPartnerModel.findByIdAndUpdate(
      id,
      {
        $set: updatedData,
      },
      { new: true, runValidators: true }
    );

     res.status(200).json({
      message: "Delivery partner details updated successfully.",
      partner: updatedPartner,
    });
  } catch (error: any) {
     res.status(500).json({
      message: "could not update partner details",
      error: error.message,
    });
  }
};

// delete partner details ( /api/partners/id )
const deletePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
       res
        .status(400)
        .json({ message: "Invalid request. Missing Delivery partner's id." });
        return
    }

    await DeliveryPartnerModel.findByIdAndDelete(id);

     res.status(200).json({ message: "Successfully deleted partner" });
  } catch (error: any) {
     res.status(500).json({
      message: "could not delete partner details",
      error: error.message,
    });
  }
};

export { getPartners, addPartners, updatePartner, deletePartner };
