import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    medicine: [
      {
        type: mongoose.ObjectId,
        ref: "Medicine",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
