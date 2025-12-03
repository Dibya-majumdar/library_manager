import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {role === 'admin' && (
          <div className="nav-section">
            <h3>Maintenance</h3>
            <Link 
              to="/maintenance/add-book" 
              className={isActive('/maintenance/add-book') ? 'active' : ''}
            >
              Add Book
            </Link>
            <Link 
              to="/maintenance/update-book" 
              className={isActive('/maintenance/update-book') ? 'active' : ''}
            >
              Update Book
            </Link>
            <Link 
              to="/maintenance/add-membership" 
              className={isActive('/maintenance/add-membership') ? 'active' : ''}
            >
              Add Membership
            </Link>
            <Link 
              to="/maintenance/update-membership" 
              className={isActive('/maintenance/update-membership') ? 'active' : ''}
            >
              Update Membership
            </Link>
            <Link 
              to="/maintenance/user-management" 
              className={isActive('/maintenance/user-management') ? 'active' : ''}
            >
              User Management
            </Link>
          </div>
        )}

        <div className="nav-section">
          <h3>Transactions</h3>
          <Link 
            to="/transactions/book-available" 
            className={isActive('/transactions/book-available') ? 'active' : ''}
          >
            Book Available
          </Link>
          <Link 
            to="/transactions/book-issue" 
            className={isActive('/transactions/book-issue') ? 'active' : ''}
          >
            Book Issue
          </Link>
          <Link 
            to="/transactions/return-book" 
            className={isActive('/transactions/return-book') ? 'active' : ''}
          >
            Return Book
          </Link>
          <Link 
            to="/transactions/fine-pay" 
            className={isActive('/transactions/fine-pay') ? 'active' : ''}
          >
            Fine Pay
          </Link>
        </div>

        {role === 'admin' && (
          <div className="nav-section">
            <h3>Reports</h3>
            <Link 
              to="/reports/issued-books" 
              className={isActive('/reports/issued-books') ? 'active' : ''}
            >
              Issued Books
            </Link>
            <Link 
              to="/reports/returned-books" 
              className={isActive('/reports/returned-books') ? 'active' : ''}
            >
              Returned Books
            </Link>
            <Link 
              to="/reports/fines" 
              className={isActive('/reports/fines') ? 'active' : ''}
            >
              Fines
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;


