import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading]=useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // State to display errors
    const navigate = useNavigate(); // React Router navigation hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error before new request
        setIsLoading(true);
        try {
            // Send POST request to login API
            const response = await axios.post("http://localhost:5000/api/users/login", {
                email,
                password,
            });

            // Handle success response
            const { accessToken } = response.data;

            // Store token in localStorage
            localStorage.setItem("token", accessToken);

            // Set the token globally in Axios headers
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

            // Navigate to a protected route (e.g., dashboard)
            toast.success("login successful");
            navigate("/dashboard");
        } catch (error) {
            // Handle errors
            if (error.response) {
                setError(error.response.data.message); // Display API error
                toast.error(error.response.data.message)
            } else {
                setError("Something went wrong. Please try again later.");
                toast.error("Something went wrong. Please try again later.");
            }
        }finally{
            setIsLoading(false); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-purple-100 to-white px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-purple-600 text-center sm:text-4xl">
                    Welcome Back
                </h1>
                <p className="mt-2 text-gray-600 text-center text-sm sm:text-base">
                    Login to your account to continue.
                </p>

                {error && (
                    <div className="mt-4 text-center text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        {!isLoading ? <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            Sign In
                        </button>:
                            <div className="w-full bg-purple-600  text-white font-bold py-2 px-4 rounded-md shadow-sm text-center">Loading...</div>}
                    </div>
                </form>

                <p className="mt-6 text-center text-gray-600 text-sm sm:text-base">
                    Don’t have an account?{" "}
                    <NavLink to="/signup" className="text-purple-600 font-medium hover:text-purple-500">
                        Sign up
                    </NavLink>
                </p>
            </div>
        </div>
    );
};

export default Login;
