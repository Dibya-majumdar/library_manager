import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Reports.css';

const IssuedBooks = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIssuedBooks();
  }, []);

  const loadIssuedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/issued-books');
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error loading issued books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <h2>Issued Books</h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Issued Books Report</h2>
        
        {error && <div className="error-message">{error}</div>}

        {transactions.length === 0 ? (
          <div>No issued books found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Serial No</th>
                  <th>User ID</th>
                  <th>Issue Date</th>
                  <th>Expected Return Date</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.bookName}</td>
                    <td>{transaction.authorName}</td>
                    <td>{transaction.serialNo}</td>
                    <td>{transaction.userId?._id || transaction.userId}</td>
                    <td>{formatDate(transaction.issueDate)}</td>
                    <td>{formatDate(transaction.expectedReturnDate)}</td>
                    <td>{transaction.remarks || '-'}</td>
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

export default IssuedBooks;





