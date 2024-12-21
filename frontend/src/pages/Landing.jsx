import React from 'react'
import { NavLink } from 'react-router-dom';
const Landing = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-purple-100 to-white">
            <div className="text-center max-w-lg">
                {/* Heading */}
                <h1 className="text-5xl font-extrabold">
                    <span className="block text-purple-600">Reach More.</span>
                    <span className="block">Work Less.</span>
                    <span className="block">Email Smarter.</span>
                </h1>

                {/* Subheading */}
                <p className="mt-6 text-gray-700 text-lg">
                    Scale your outreach effortlessly: Send personalized emails to large
                    audiences without compromising quality.
                </p>

                {/* Call to Action */}
                <p className="mt-6 text-lg font-medium mb-5">Send Your First 1000 Emails Free</p>

                {/* Button */}
                <NavLink to="login" className="mt-7 px-6 py-3 bg-black text-white text-lg font-semibold rounded-md hover:bg-gray-800 transition"
                >
                    Get Started
                </NavLink>
            </div>
        </div>
    );
}

export default Landing;
