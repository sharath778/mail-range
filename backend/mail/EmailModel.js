import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    senderEmail: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", EmailSchema);
export default Email;
