import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },

    ownerEmailSent: {
      type: Number,
      required: true,
      default: 0,
    },
    ownerEmailLimitResetDate: {
      type: Date,
      required: true,
      default: () => {
        const current = new Date();
        const resetHour = 0; // Reset at midnight (hour 0)
        const resetMinute = 0; // Reset at midnight (minute 0)
        const tomorrow = new Date(current.getTime() + 24 * 60 * 60 * 1000);
        tomorrow.setHours(resetHour, resetMinute, 0, 0); // Set tomorrow's reset time
        return tomorrow;
      },
    },

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
    mailType: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    userSenderName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// Mongoose middleware to reset email limits daily (at midnight)
mailSchema.pre("save", async function (next) {
  const current = new Date();
  const resetHour = 0; // Reset at midnight (hour 0)
  const resetMinute = 0; // Reset at midnight (minute 0)

  // Check if the current time has passed the daily reset time
  if (current.getHours() >= resetHour && current.getMinutes() >= resetMinute) {
    const tomorrow = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(resetHour, resetMinute, 0, 0); // Set tomorrow's reset time

    // Reset email limit only if the last reset date is before today's midnight
    if (this.ownerEmailLimitResetDate < tomorrow) {
      this.ownerEmailSent = 0;
      this.ownerEmailLimitResetDate = tomorrow;
    }
  }

  next(); // Continue with the save operation
});

const Mail = mongoose.model("Mail", mailSchema);
export default Mail;
