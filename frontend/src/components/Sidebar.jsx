import React, { useState, useEffect, useContext } from 'react';
import './css/Sidebar.css';
import { Home, List, History, ChartNoAxesColumnIncreasing, User, Settings, HelpCircle, Menu } from 'lucide-react';
import { LinkContext } from '../context/LinkContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { content, setContent } = useContext(LinkContext);
    const [listOpen, setListOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        setContent(path);
        navigate(`/${path}`);
    };

    useEffect(() => {
        handleNavigation(content);
    }, [content]);

    return (
        <nav className={`sidebar ${menuOpen ? 'responsive' : ''}`}>
            <div className="icon" onClick={() => setMenuOpen(!menuOpen)}>
                <Menu />
            </div>
            <div className="nav-menu">
                <ul>
                    <li
                        className={content === "dashboard" ? "active" : ""}
                        onClick={() => handleNavigation('dashboard')}
                    >
                        <span><Home /></span> Dashboard
                    </li>
                    <li onClick={() => setListOpen(!listOpen)}>
                        <span><List /></span> List
                    </li>
                    {listOpen && (
                        <ul className="dropdown">
                            <li
                                className={content === "dashboard/send-email-configurations" ? "active" : ""}
                                onClick={() => handleNavigation('dashboard/send-email-configurations')}
                            >
                                Sender Email Configuration
                            </li>
                            <li
                                className={content === "dashboard/email-list" ? "active" : ""}
                                onClick={() => handleNavigation('dashboard/email-list')}
                            >
                                Email List
                            </li>
                            <li
                                className={content === "dashboard/email-body" ? "active" : ""}
                                onClick={() => handleNavigation('dashboard/email-body')}
                            >
                                Email Body
                            </li>
                        </ul>
                    )}
                    <li
                        className={content === "dashboard/history" ? "active" : ""}
                        onClick={() => handleNavigation('dashboard/history')}
                    >
                        <span><History /></span> History
                    </li>
                    <li
                        className={content === "dashboard/reports" ? "active" : ""}
                        onClick={() => handleNavigation('dashboard/reports')}
                    >
                        <span><ChartNoAxesColumnIncreasing /></span> Reports
                    </li>
                </ul>
                <p>Settings</p>
                <ul>
                    <li
                        className={content === "profile" ? "active" : ""}
                        onClick={() => handleNavigation('profile')}
                    >
                        <span><User /></span> Profile
                    </li>
                    <li
                        className={content === "settings" ? "active" : ""}
                        onClick={() => handleNavigation('settings')}
                    >
                        <span><Settings /></span> Settings
                    </li>
                    <li
                        className={content === "help" ? "active" : ""}
                        onClick={() => handleNavigation('help')}
                    >
                        <span><HelpCircle /></span> Help
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;
