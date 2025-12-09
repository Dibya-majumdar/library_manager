import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Login from './components/Auth/Login';

// Maintenance Components
import AddBook from './components/Maintenance/AddBook';
import UpdateBook from './components/Maintenance/UpdateBook';
import AddMembership from './components/Maintenance/AddMembership';
import UpdateMembership from './components/Maintenance/UpdateMembership';
import UserManagement from './components/Maintenance/UserManagement';

// Transaction Components
import BookAvailable from './components/Transactions/BookAvailable';
import BookIssue from './components/Transactions/BookIssue';
import ReturnBook from './components/Transactions/ReturnBook';
import FinePay from './components/Transactions/FinePay';

// Report Components
import MasterListBooks from './components/Reports/MasterListBooks';
import MasterListMovies from './components/Reports/MasterListMovies';
import MasterListMemberships from './components/Reports/MasterListMemberships';
import ActiveIssues from './components/Reports/ActiveIssues';
import OverdueReturns from './components/Reports/OverdueReturns';
import IssueRequests from './components/Reports/IssueRequests';
import IssuedBooks from './components/Reports/IssuedBooks';
import ReturnedBooks from './components/Reports/ReturnedBooks';
import Fines from './components/Reports/Fines';

import './App.css';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/transactions" replace />;
  }

  return children;
};

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

const Charts = () => {
  return (
    <Layout>
      <div className="page-container">
        <h2>Charts</h2>
        <p>Chart functionality is not implemented as per requirements.</p>
      </div>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/maintenance/add-book"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <AddBook />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/update-book"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <UpdateBook />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/add-membership"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <AddMembership />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/update-membership"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <UpdateMembership />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/user-management"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Navigate to="/maintenance/add-book" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions/book-available"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookAvailable />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/book-issue"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookIssue />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/return-book"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReturnBook />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/fine-pay"
            element={
              <ProtectedRoute>
                <Layout>
                  <FinePay />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Navigate to="/transactions/book-available" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/master-list-books"
            element={
              <ProtectedRoute>
                <Layout>
                  <MasterListBooks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/master-list-movies"
            element={
              <ProtectedRoute>
                <Layout>
                  <MasterListMovies />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/master-list-memberships"
            element={
              <ProtectedRoute>
                <Layout>
                  <MasterListMemberships />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/active-issues"
            element={
              <ProtectedRoute>
                <Layout>
                  <ActiveIssues />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/overdue-returns"
            element={
              <ProtectedRoute>
                <Layout>
                  <OverdueReturns />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/issue-requests"
            element={
              <ProtectedRoute>
                <Layout>
                  <IssueRequests />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/issued-books"
            element={
              <ProtectedRoute>
                <Layout>
                  <IssuedBooks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/returned-books"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReturnedBooks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/fines"
            element={
              <ProtectedRoute>
                <Layout>
                  <Fines />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Navigate to="/reports/master-list-books" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/charts"
            element={
              <ProtectedRoute>
                <Charts />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;



