import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Reports.css';

const IssueRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIssueRequests();
  }, []);

  const loadIssueRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/issue-requests');
      setRequests(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading issue requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <h2>Issue Requests</h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Issue Requests</h2>
        
        {error && <div className="error-message">{error}</div>}

        {requests.length === 0 ? (
          <div>No issue requests found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User Id</th>
                  <th>Name of Book/Movie</th>
                  <th>Requested Date</th>
                  <th>Request Fulfilled Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.userId?._id || request.userId}</td>
                    <td>{request.bookName || 'N/A'}</td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>{request.issueDate ? formatDate(request.issueDate) : 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueRequests;


