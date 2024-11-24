import mongoose, { Schema } from "mongoose";

type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: "pending" | "assigned" | "picked" | "delivered";
  scheduledFor: string; // HH:MM
  assignedTo?: Schema.Types.ObjectId; // partner id
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const OrderSchema = new Schema<Order>(
  {
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
      type: mongoose.Types.ObjectId,
      ref: "DeliveryPartner",
      default: null,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default OrderModel;
