import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiBookOpen, FiFileText, FiUser, FiLogOut } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add logout logic here
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <div className="navbar-brand">Blog Editor</div>
                <div className="navbar-right">
                    <FiUser className="profile-icon" />
                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <p className="welcome-text">Welcome to Blog Editor</p>
                
                <div className="action-buttons">
                    <button 
                        className="action-btn"
                        onClick={() => navigate('/editor')}
                    >
                        <FiEdit />
                        <span>Create Blog</span>
                    </button>

                    <button 
                        className="action-btn"
                        onClick={() => navigate('/published-blogs')}
                    >
                        <FiBookOpen />
                        <span>Published Blogs</span>
                    </button>

                    <button 
                        className="action-btn"
                        onClick={() => navigate('/draft-blogs')}
                    >
                        <FiFileText />
                        <span>Drafted Blogs</span>
                    </button>
                </div>
            </main>

            <footer className="footer">
                <p>&copy; 2024 Blog Editor. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;