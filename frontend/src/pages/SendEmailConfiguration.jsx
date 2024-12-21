
import { useState, useEffect } from "react";
import React from "react";
import Sidebar from "../components/Sidebar";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import "./css/SendEmailConfiguration.css";

const SendEmailConfiguration = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State for form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mailType, setMailType] = useState("gmail"); // Default option
    const [sendermails, setSenderMails] = useState([]);

    // Fetch sendermails from server
    const getSenderMails = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/mail/all-sendermails",{},
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            
            setSenderMails(response.data.mails);
            
        }catch(e){
            toast.error("Failed to fetch sendermails.");
            console.error("Error:", e.message);
        }
    };
    // Fetch sendermails on component mount
    useEffect(() => {
        getSenderMails();
    }, []);
    // Open and Close Modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true); // Start loading spinner

        try {

            // Axios POST request
            const response = await axios.post(
                "http://localhost:5000/api/mail/add-sendermails",
                {
                    userSenderEmail:email,
                    userSenderPassword:password,
                    userSenderName:name,
                    mailType
                },
                {
                    headers: { "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                     },
                }
            );

            // Handle success
            toast.success("Details added successfully!");
            console.log("Response:", response.data);

            // Reset form fields
            setName("");
            setEmail("");
            setPassword("");
            setMailType("gmail");
            closeModal(); // Close modal
            getSenderMails(); // Fetch updated sendermails
        } catch (error) {
            // Handle errors
            console.error("Error:", error);
            if (error.response) {
                toast.error(error.response.data.message || "Failed to submit details");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false); // Stop loading spinner
        }
    };
    
    const deleteMail = async (id)=>{

        try{
            const response = await axios.delete(`http://localhost:5000/api/mail/delete-sendermails/${id}`,
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            setSenderMails((prevMails) => prevMails.filter(mail => mail._id !== id));

            toast.success("Email details deleted successfully!");
            
        } catch (error) {
            console.error("Error deleting email:", error);
            toast.error("Failed to delete email details.");
        }
        
    }

    return (
        <>
            <Sidebar />
            <div className="selected-content">
                <div>
                    <button className="btn" onClick={openModal}>
                        Add Details
                    </button>
                </div>
                <div className="email-list-table">
                    <table>
                        <thead>
                            <tr>
                                <th>S No.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Sent</th>
                                <th>Mail Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sendermails? sendermails.map((sendermail)=>(
                                <tr>
                                    <td>1</td>
                                    <td>{sendermail.userSenderName}</td>
                                    <td>{sendermail.userSenderEmail}</td>
                                    <td className=" ">Sent</td>
                                    <td>{sendermail.ownerEmailSent}</td>
                                    <td>gmail</td>
                                    <td className="flex gap-2">
                                        <div onClick={()=>deleteMail(sendermail._id)} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg transform transition-all duration-300 hover:bg-blue-700 hover:scale-105 active:bg-blue-800 active:scale-95">
                                            <Trash2 className="cursor-pointer " />
                                        </div>

                                    </td>
                                </tr>
                            )
                            ) : <></>}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Add Sender Credentials</h2>
                            <form onSubmit={handleSubmit}>
                                {/* Name Field */}
                                <div>
                                    <label>Enter Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label>Enter Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label>Enter Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Mail Type Field */}
                                <div>
                                    <label>Select Mail Type:</label>
                                    <select
                                        name="mailType"
                                        value={mailType}
                                        onChange={(e) => setMailType(e.target.value)}
                                        required
                                    >
                                        <option value="gmail">Gmail</option>
                                        <option value="outlook">Outlook</option>
                                        <option value="hostinger">Hostinger</option>
                                    </select>
                                </div>

                                {/* Modal Actions */}
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn close-btn"
                                        onClick={closeModal}
                                        disabled={isLoading}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        className={`btn submit-btn ${isLoading ? "cursor-not-allowed" : ""
                                            }`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Submitting..." : "Add Details"}
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

export default SendEmailConfiguration;
