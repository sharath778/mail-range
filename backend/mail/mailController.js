import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Mail from './mailModel.js';
import Email from './EmailModel.js';
import UserSender from './UserSenderModel.js';
import EmailBody from './emailBodyMode.js';

// Initialize dotenv to load environment variables
dotenv.config();

export const saveMails = async (req, res) => {
  const {
    senderEmail,
    senderPassword,
    subject,
    emails,
    html,
    mailType,
    userSenderName,
  } = req.body;

  if (
    !senderEmail ||
    !senderPassword ||
    !subject ||
    !html ||
    !emails ||
    !userSenderName
  ) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }

  // Santize the emails array
  const emailslist = emails.filter((email) => email.trim() !== "");

  console.log("Emails - ", emails.length);
  console.log("emailslist - ", emailslist.length);

  try {
    console.log("EMAILS LIST - ", emailslist);

    if (emailslist.length > 0) {
      const data = await Mail.create({
        userSenderName: userSenderName,
        ownerId: req.user._id,
        ownerEmailSent: emailslist.length,
        userSenderEmail: senderEmail,
        userSenderPassword: senderPassword,
        userSenderName: req.user.name,
        mailType: "gmail",
        subject: subject,
        html: html,
      });

      const emailDocuments = emailslist.map((email) => ({
        ownerId: req.user._id,
        email,
        status: false,
      }));

      const result = await Email.insertMany(emailDocuments);
      console.log(`${result.length} emails saved successfully.`);

      console.log(data);

      return res.status(200).json({
        message: "Emails saved successfully",
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error while saving emails",
      success: false,
    });
  }
};

export const sendMail = async (req, res) => {
  const { emailId } = req.body;
  try {
    const jobs = await UserSender.find({ ownerId: req.user._id });
    if(jobs.length <1)return res.status(404).json({ message:"Please add the sender mail",success:false});
    console.log(jobs+"form SendMail contoller");
    const { subject, html } = await EmailBody.findOne({
      ownerId: req.user._id,
      _id: emailId
    });
    
    let emails = await Email.find({ ownerId: req.user._id, status: false });

    console.log("Total sender emails:", jobs.length);
    console.log("Emails to send:", emails.length);

    if (emails.length === 0) {
      return res.status(200).json({
        message: "No emails to send",
        success: true,
      });
    }

    const MAX_DAILY_LIMIT = 5000; // New daily limit per sender
    const BATCH_SIZE = 20; // Number of emails to process in each batch

    // Function to send emails for a single job
    const processJob = async (job, emailBatch) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,//587(STARTTLS), //465(SSL)
        secure: true,//false(STARTTLS),//true(SSL)
        auth: {
          user: job.userSenderEmail,
          pass: job.userSenderPassword,
        },
      });

      for (const recipient of emailBatch) {
        const mailOptions = {
          from: `${job.userSenderName} <${job.userSenderEmail}>`,
          to: recipient.email,
          subject: subject,
          html: html,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          await Email.updateOne(
            { ownerId: req.user._id, email: recipient.email },
            { $set: { status: true, senderEmail: info.envelope.from } }
          );
          await UserSender.updateOne(
            { _id: job._id },
            { $inc: { ownerEmailSent: 1 } }
          );
          console.log(
            `Email sent From ${info.envelope.from}  - to ${recipient.email}: ${info.response}`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
        } catch (error) {
          console.error(`Error sending email to ${recipient.email}:`, error);
        }
      }
    };

    // Parallel processing of jobs
    const processAllJobs = async () => {
      while (emails.length > 0) {
        const jobPromises = jobs.map(async (job) => {
          const jobEmails = emails.splice(
            0,
            Math.min(BATCH_SIZE, MAX_DAILY_LIMIT)
          );
          if (jobEmails.length > 0) {
            await processJob(job, jobEmails);
          }
        });

        await Promise.all(jobPromises);
      }
    };

    await processAllJobs();

    return res.status(200).json({
      message: "Email sending process completed",
      success: true,
      remainingEmails: emails.length,
    });
  } catch (error) {
    console.error("Error in sendMail function:", error);
    return res.status(500).json({
      message: "An error occurred while sending emails",
      success: false,
      error: error.message,
    });
  }
};

export const getAllMails = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = 100;
    const skip = (page - 1) * limit;

    const totalMails = await Email.countDocuments({
      ownerId: req.user._id,
      status: false,
    });
    console.log("emails", totalMails);
    const totalPages = Math.ceil(totalMails / limit);

    const mails = await Email.find(
      { ownerId: req.user._id },
      {},
      {
        skip: skip,
        limit: limit,
      }
    );

    if (mails.length > 0) {
      return res.status(200).json({
        mails,
        currentPage: page,
        totalPages,
        totalMails,
      });
    } else {
      return res.status(200).json({
        message: "No mails found",
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error while fetching mails",
      success: false,
    });
  }
};

export const deleteMail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Email ID is required",
        success: false,
      });
    }

    const result = await Email.findOneAndDelete({
      _id: id,
      ownerId: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        message: "Email not found or you don't have permission to delete it",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Email deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in deleteMail:", err);
    return res.status(500).json({
      message: "Error while deleting email",
      success: false,
      error: err.message,
    });
  }
};

export const AddMails = async (req, res) => {
  // console.log(req.body);
  const { emails } = req.body;

  const emailslist = emails.filter((email) => email.trim() !== "");

  console.log("Original emails:", emails.length);
  console.log("Filtered emails:", emailslist.length);

  if (emailslist.length === 0) {
    return res.status(400).json({
      message: "No valid emails provided",
      success: false,
    });
  }

  try {
    // You can add a check for user limits here if needed
    // For example:
    // const existingEmails = await Email.countDocuments({ ownerId: req.user._id });
    // if (existingEmails + emailslist.length > USER_EMAIL_LIMIT) {
    //   throw new Error("Maximum limit exceeded");
    // }

    const emailDocuments = emailslist.map((email) => ({
      ownerId: req.user._id,
      email,
      status: false,
    }));

    const result = await Email.insertMany(emailDocuments);
    console.log(`${result.length} emails saved successfully.`);

    return res.status(200).json({
      message: "Emails added successfully",
      success: true,
      count: result.length,
    });
  } catch (err) {
    console.error("Error in AddMails:", err);
    return res.status(400).json({
      message: err.message || "Error while saving emails",
      success: false,
    });
  }
};

export const getAllMailSender = async (req, res) => {
  try {
    const mails = await UserSender.find({ ownerId: req.user._id });
    // console.log(mails);
    if (mails.length > 0) {
      return res.status(200).json({
        mails,
      });
    } else {
      return res.status(200).json({
        message: "No mails found",
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error while fetching mails",
      success: false,
    });
  }
};

export const AddEmailSenderDetails = async (req, res) => {
  const {
    userSenderEmail,
    userSenderPassword,
    userSenderName,
    mailtype = "gmail",
  } = req.body;

  console.log(userSenderEmail)
  console.log(userSenderPassword)
  console.log(userSenderName)
  console.log(mailtype)

  console.log(req.body);

  if (!userSenderEmail || !userSenderPassword || !userSenderName || !mailtype) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }

  try {
    const data = await UserSender.create({
      userSenderEmail,
      userSenderPassword,
      userSenderName,
      mailType: mailtype,
      ownerId: req.user._id,
    });

    const newData = await UserSender.find({ ownerId: req.user._id });

    return res.status(200).json({
      mails: newData,
      message: "Email Sender details saved successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error while saving email sender details",
      success: false,
    });
  }
};

export const saveEmailbody = async (req, res) => {
  const { subject, html } = req.body;
  console.log(req.body);
  try {
    const data = await EmailBody.create({
      subject,
      html,
      ownerId: req.user._id,
    });

    return res.status(200).json({
      data: data,
      message: "Email Body saved successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error while saving email body",
      success: false,
    });
  }
};

export const getEmailBody = async (req, res) => {
  try {
    const data = await EmailBody.find({ ownerId: req.user._id });

    if (data) {
      return res.status(200).json({
        data,
        message: "Email Body fetched successfully",
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error while fetching email body",
      success: false,
    });
  }
};

export const getHistoryEmails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from query params, default to 1
    const limit = 100; // Number of items per page
    const skip = (page - 1) * limit; // Calculate number of documents to skip

    console.log("REQ_USER - ", req.user._id);

    const totalMails = await Mail.countDocuments({ ownerId: req.user._id });
    const totalPages = Math.ceil(totalMails / limit);

    const mails = await Email.find(
      { ownerId: req.user._id, status: true },
      {},
      {
        skip: skip,
        limit: limit,
        sort: {
          updatedAt: -1,
        },
      }
    );

    if (mails.length > 0) {
      return res.status(200).json({
        mails,
      });
    } else {
      return res.status(200).json({
        message: "No mails found",
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error while fetching mails",
      success: false,
    });
  }
};

export const updateMailBody = async (req, res) => {
  const { subject, html } = req.body;
  console.log(req.body);
  try {
    const data = await EmailBody.findOneAndUpdate(
      { ownerId: req.user._id },
      { subject, html },
      { new: true }
    );

    return res.status(200).json({
      data: data,
      message: "Email Body updated successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error while updating email body",
      success: false,
    });
  }
};

export const deleteEmailBody = async (req, res) => {
  const emailBodyId = req.params.id;
  try {
    const result = await EmailBody.findOneAndDelete({
      _id: emailBodyId,
      ownerId: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        message: "Email body not found or you don't have permission to delete it",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Email body deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in deleteEmailBody:", err);
    return res.status(500).json({
      message: "Error while deleting email body",
      success: false,
      error: err.message,
    });
  }
};

export const userSenderMailDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Email ID is required",
        success: false,
      });
    }

    const result = await UserSender.findOneAndDelete({
      _id: id,
      ownerId: req.user._id,
    });

    if (!result) {
      return res.status(404).json({
        message: "Email not found or you don't have permission to delete it",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Email deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error in userSenderMailDelete:", err);
    return res.status(500).json({
      message: "Error while deleting email",
      success: false,
      error: err.message,
    });
  }
};
