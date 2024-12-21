import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import Sidebar from '../components/Sidebar';
import axios from "axios";
import './css/EmailBody.css';

const EmailBody = () => {
  const [form, setForm] = useState({
    subject: "",
    hc: ""
  });
  const [emailBodies, setEmailBodies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form field changes
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle form submission (save email body)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/mail/save-emailbody",
        {
          subject: form.subject,
          html: form.hc
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      );
      toast.success("Email saved successfully!!");
      setForm({
        subject: "",
        hc: ""
      }); // Clear form after successful submission
      getEmailBodies(); // Refresh the list after saving a new email body
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch list of email bodies from server
  const getEmailBodies = async () => {
    try {
      const response = await axios.post("/api/mail/all-emailbody", {}, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      setEmailBodies(response.data.data); // Assuming response.data is an array of email bodies
    } catch (e) {
      toast.error("Failed to fetch email bodies");
    }
  };

  // Delete email body
  const deleteEmailBody = async (id) => {
    try {
      await axios.delete(`/api/mail/delete-emailbody/${id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      toast.success("Email body deleted successfully!");
      getEmailBodies(); // Refresh the list after deletion
    } catch (e) {
      toast.error("Failed to delete email body"+ e.message);
    }
  };

  // Handle selecting an email body for editing
  const handleSelectEmailBody = (emailBody) => {
    setForm({
      subject: emailBody.subject,
      hc: emailBody.html
    });
  };

  // Fetch email bodies on component mount
  useEffect(() => {
    getEmailBodies();
  }, []);

  return (
    <>
      <Sidebar />
      <div className='selected-content'>
        <div>
          <div className="email-body-heading">
            <h1>Email Template Editor</h1>
            {isLoading ?
              <div className="btn text-xs">loading...</div> :
              <button className='btn' onClick={handleSubmit}>Save Changes</button>}
          </div>
          <form className='email-body-form'>
            <div>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className='email-body-form-row'>
              <div>
                <label htmlFor="hc">HTML Content</label>
                <textarea
                  name="hc"
                  id="hc"
                  rows={10}
                  value={form.hc}
                  onChange={handleOnChange}
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="preview">Preview</label>
                <textarea
                  name="preview"
                  id="preview"
                  rows={10}
                  value={form.hc}
                  readOnly
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="email-bodies-list">
          <h2>Saved Email Bodies</h2>
          <div className="email-bodies-container">
            {emailBodies && emailBodies.length > 0 ? (
              emailBodies.map((emailBody) => (
                <div className="email-body-card" key={emailBody._id}>
                  <h3>{emailBody.subject}</h3>
                  <p>{emailBody.html.slice(0, 100)}...</p>
                  <div className="email-body-actions">
                    <button
                      className="btn edit-btn"
                      onClick={() => handleSelectEmailBody(emailBody)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete-btn ml-3"
                      onClick={() => deleteEmailBody(emailBody._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No email bodies found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailBody;
