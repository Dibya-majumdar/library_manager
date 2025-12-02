import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/">Library Management System</Link>
        </div>
        
        <div className="navbar-links">
          <span className="user-role">Role: {role === 'admin' ? 'Admin' : 'User'}</span>
          
          {role === 'admin' && (
            <>
              <Link to="/maintenance">Maintenance</Link>
              <Link to="/reports">Reports</Link>
            </>
          )}
          
          <Link to="/transactions">Transactions</Link>
          <Link to="/charts" className="chart-link">Charts</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

