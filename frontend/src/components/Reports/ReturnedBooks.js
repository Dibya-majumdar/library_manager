import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Reports.css';

const ReturnedBooks = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReturnedBooks();
  }, []);

  const loadReturnedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/returned-books');
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error loading returned books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <h2>Returned Books</h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Returned Books Report</h2>
        
        {error && <div className="error-message">{error}</div>}

        {transactions.length === 0 ? (
          <div>No returned books found.</div>
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
                  <th>Actual Return Date</th>
                  <th>Fine Amount</th>
                  <th>Fine Paid</th>
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
                    <td>{formatDate(transaction.actualReturnDate)}</td>
                    <td>${transaction.fineAmount || 0}</td>
                    <td>{transaction.finePaid ? 'Yes' : 'No'}</td>
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

export default ReturnedBooks;


