import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './css/Dashboard.css';
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from 'axios';

const Dashboard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // For controlling the popup visibility
  const [emailsInput, setEmailsInput] = useState("");  // Stores the input value
  const [emails, setEmails] = useState([]); // Stores the array of email addresses
  const [getMail, setMails] = useState([]); // Stores the array of emails
  const [isSendPopupOpen, setIsSendPopupOpen] = useState(false); // Controls the send email popup visibility
  const [selectedEmail, setSelectedEmail] = useState(""); // Stores the selected email to send
  const [emailBodies, setEmailBodies] = useState([]); // Stores the email bodies

  // Fetch existing emails from the server
  const fetchMails = async () => {
    try {
      const response = await axios.post("/api/mail/all", {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
      setMails(response.data.mails); // Update the state with the fetched emails
    } catch (e) {
      console.log(e.message);
      toast.error("Failed to fetch emails.");
    }
  };

  const fetchMailBodies = async ()=>{
    try {
      const response = await axios.post("/api/mail/all-emailbody", {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      // console.log(response);
      setEmailBodies(response.data.data); 
      console.log(emailBodies);// Assuming response.data is an array of email bodies
    } catch (e) {
      toast.error("Failed to fetch email bodies");
    }
  }
  // Handle adding a new email
  const handleAddMailClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEmailsInput(""); // Reset input when closing
  };

  // Handles form submission and stores emails as an array
  const handleSubmitEmails = async (e) => {
    e.preventDefault();
    const emailArray = emailsInput.split(",").map(email => email.trim());

    if (emailArray.length === 0) {
      toast.error("Please enter at least one email.");
      return;
    }

    try {
      const response = await axios.post("/api/mail/add-mails",
        { emails: emailArray },
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }
      );

      if (response.data.success) {
        setEmails(emailArray);
        toast.success(response.data.message);
        fetchMails();
        setIsPopupOpen(false);
      }
    } catch (error) {
      console.error("Error while adding emails:", error);
      toast.error(error.response?.data?.message || "Error while saving emails");
    } finally {
      setEmailsInput(""); // Clear input after submission
    }
  };

  const handleCloseSendPopup = () => {
    setIsSendPopupOpen(false); // Close the send email popup
  };

  const handleSendMailClick = () => {
    setIsSendPopupOpen(true);  // Open the send email popup
  };


  // Function to handle email deletion
  const handleDeleteMail = async (id) => {
    try {
      const response = await axios.post(`/api/mail/delete/${id}`, {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchMails(); // Refresh the email list after successful deletion
      }
    } catch (error) {
      console.error("Error while deleting email:", error);
      toast.error(error.response?.data?.message || "Error while deleting email");
    }
  };

  const handleSendEmail = async () => {
    if (!selectedEmail) {
      toast.error("Please select an email to send.");
      return;
    }

    try {
      const response = await axios.post(`/api/mail/send`,
        { emailId: selectedEmail},
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }
      );

      if (response.data.success) {
        toast.success("Email sent successfully!");
        setIsSendPopupOpen(false); // Close the popup after successful send
      }
    } catch (error) {
      console.error("Error while sending email:", error);
      toast.error(error.response?.data?.message || "Error while sending email");
    }
  };

  useEffect(() => {
    fetchMails(); 
    fetchMailBodies();// Fetch emails when the component mounts
  }, []);

  return (
    <>
      <Sidebar />
      <div className="selected-content">
        <div className="dashboard-nav">
          <h1>Welcome, Ankit Kumar</h1>
          <p>Plan: free</p>
          <p>Created At: 12/10/2024, 10:39:46 PM</p>
        </div>

        <div className="dashboard-email-list">
          <div className="email-list">
            <div className="email-list-heading">
              <h1>Email-List -</h1>
              <span>{emails.length}</span>
            </div>
            <div className="email-list-button">
              <button onClick={handleAddMailClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Add Mail</button>
              <button onClick={handleSendMailClick} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Send Mails</button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700">Add Mail Details</button>
            </div>
          </div>

          <div className="email-list-table">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">S No.</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getMail && getMail.length > 0 ? getMail.map((email, index) => (
                  <tr key={email._id}>
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">{email.email}</td>
                    <td className="px-4 py-2 border-b">Not Sent</td>
                    <td className="px-4 py-2 border-b">
                      <button onClick={() => handleDeleteMail(email._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="4" className="text-center py-4">No mails added!!</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Add Emails</h2>
              <form onSubmit={handleSubmitEmails}>
                <label htmlFor="emails" className="block text-sm font-medium text-gray-700">Enter Emails (separate by commas):</label>
                <input
                  type="text"
                  id="emails"
                  value={emailsInput}
                  onChange={(e) => setEmailsInput(e.target.value)}
                  className="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter emails separated by commas"
                />
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isSendPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Select Email to Send</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                {emailBodies && emailBodies.length>0 ?emailBodies.map((email) => (
                  <div key={email._id} className="flex items-center mb-4">
                    <input
                      type="radio"
                      id={email._id}
                      name="email"
                      value={email._id}
                      onChange={() => setSelectedEmail(email._id)} // Set selected email
                      className="mr-2"
                    />
                    <label htmlFor={email._id} className="text-sm font-medium text-gray-700">{email.subject}</label>
                  </div>
                )) : <p>No bodies are present!!</p>}
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handleCloseSendPopup}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      </div>
    </>
  );
};

export default Dashboard;
