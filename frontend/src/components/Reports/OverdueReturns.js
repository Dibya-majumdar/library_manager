import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Reports.css';

const OverdueReturns = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOverdueReturns();
  }, []);

  const loadOverdueReturns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/overdue-returns');
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading overdue returns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <h2>Overdue Returns</h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Overdue Returns</h2>
        
        {error && <div className="error-message">{error}</div>}

        {transactions.length === 0 ? (
          <div>No overdue returns found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Serial No Book</th>
                  <th>Name of Book</th>
                  <th>Membership Id</th>
                  <th>Date of Issue</th>
                  <th>Date of return</th>
                  <th>Fine Calculations</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const today = new Date();
                  const expectedReturn = new Date(transaction.expectedReturnDate);
                  const lateDays = Math.ceil((today - expectedReturn) / (1000 * 60 * 60 * 24));
                  const fineAmount = lateDays > 0 ? lateDays * 10 : 0;
                  
                  return (
                    <tr key={transaction._id}>
                      <td>{transaction.serialNo}</td>
                      <td>{transaction.bookName}</td>
                      <td>{transaction.userId?._id || transaction.userId}</td>
                      <td>{formatDate(transaction.issueDate)}</td>
                      <td>{formatDate(transaction.expectedReturnDate)}</td>
                      <td>${fineAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueReturns;




