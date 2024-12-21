import mongoose from 'mongoose';

const UserSenderModel = new mongoose.Schema(
  {
    userSenderEmail: {
      type: String,
      required: true,
    },
    userSenderPassword: {
      type: String,
      required: true,
    },
    userSenderName: {
      type: String,
      required: true,
    },
    ownerEmailSent: {
      type: Number,
      default: 0,
    },
    mailType: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// everyday at midnight, reset the ownerEmailSent to 0
UserSenderModel.pre("save", function (next) {
  const current = new Date();
  const resetHour = 0; // Reset at midnight (hour 0)
  const resetMinute = 0; // Reset at midnight (minute 0)
  const tomorrow = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(resetHour, resetMinute, 0, 0); // Set tomorrow's reset time
  this.ownerEmailLimitResetDate = tomorrow;
  next();
});

const UserSender = mongoose.model("UserSender", UserSenderModel);
export default UserSender;
