import mongoose, { Schema, Types } from "mongoose";

type Assignment = {
  _id: string;
  orderId: Types.ObjectId | string; // Reference to Order document
  partnerId: Types.ObjectId | string; // Reference to DeliveryPartner document
  timestamp: Date;
  status: "success" | "failure";
  reason?: string;
};

const AssignmentSchema = new Schema<Assignment>(
  {
    orderId: {
      type: Schema.Types.ObjectId, 
      ref: "Order",
      required: true, 
    },
    partnerId: {
      type: Schema.Types.ObjectId, 
      ref: "DeliveryPartner",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, 
    },
    status: {
      type: String,
      enum: ["success", "failure"], 
      required: true,
    },
    reason: {
      type: String,
      required: function () {
        return this.status === "failure"; 
      },
    },
  },
  { timestamps: true }
);

const AssignmentModel =
  mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);

export default AssignmentModel;
