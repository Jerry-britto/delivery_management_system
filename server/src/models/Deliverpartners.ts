import mongoose, { Schema } from "mongoose";

type DeliveryPartner = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  currentLoad: number;
  areas: string[];
  shift: {
    start: string;
    end: string;
  };
  metrics: {
    rating: number;
    completedOrder: number;
    cancelledOrders: number;
  };
};

const DeliveryPartnerSchema = new Schema<DeliveryPartner>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    phone: {
      type: String,
      min:8,
      required: true,
      unique: true, 
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    currentLoad: {
      type: Number,
      default: 0, 
      max:[3,"There can be max 3 loads for a partner"]
    },
    areas: {
      type: [String], 
      default: [], 
    },
    shift: {
      start: {
        type: String,
        required: true, 
      },
      end: {
        type: String,
        required: true,
      },
    },
    metrics: {
      rating: {
        type: Number,
        default: 0, 
      },
      completedOrders: {
        type: Number,
        default: 0, 
      },
      cancelledOrders: {
        type: Number,
        default: 0, 
      },
    },
  },
  { timestamps: true }
);

const DeliveryPartnerModel =
  mongoose.models.DeliveryPartner || 
  mongoose.model("DeliveryPartner", DeliveryPartnerSchema);

export default DeliveryPartnerModel;
