import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Reports.css';

const ActiveIssues = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActiveIssues();
  }, []);

  const loadActiveIssues = async () => {
    try {
      setLoading(true);
      const response = await api.get('/issued-books');
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error loading active issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <h2>Active Issues</h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Active Issues</h2>
        
        {error && <div className="error-message">{error}</div>}

        {transactions.length === 0 ? (
          <div>No active issues found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Serial No Book/Movie</th>
                  <th>Name of Book/Movie</th>
                  <th>Membership Id</th>
                  <th>Date of Issue</th>
                  <th>Date of return</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.serialNo}</td>
                    <td>{transaction.bookName}</td>
                    <td>{transaction.userId?._id || transaction.userId}</td>
                    <td>{formatDate(transaction.issueDate)}</td>
                    <td>{formatDate(transaction.expectedReturnDate)}</td>
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

export default ActiveIssues;


