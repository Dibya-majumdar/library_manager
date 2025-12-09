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

        <div className="nav-section">
          <h3>Reports</h3>
          <Link 
            to="/reports/master-list-books" 
            className={isActive('/reports/master-list-books') ? 'active' : ''}
          >
            Master List of Books
          </Link>
          <Link 
            to="/reports/master-list-movies" 
            className={isActive('/reports/master-list-movies') ? 'active' : ''}
          >
            Master List of Movies
          </Link>
          <Link 
            to="/reports/master-list-memberships" 
            className={isActive('/reports/master-list-memberships') ? 'active' : ''}
          >
            Master List of Memberships
          </Link>
          <Link 
            to="/reports/active-issues" 
            className={isActive('/reports/active-issues') ? 'active' : ''}
          >
            Active Issues
          </Link>
          <Link 
            to="/reports/overdue-returns" 
            className={isActive('/reports/overdue-returns') ? 'active' : ''}
          >
            Overdue Returns
          </Link>
          <Link 
            to="/reports/issue-requests" 
            className={isActive('/reports/issue-requests') ? 'active' : ''}
          >
            Issue Requests
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;



