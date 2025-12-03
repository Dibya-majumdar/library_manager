import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Reports.css';

const Fines = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFines();
  }, []);

  const loadFines = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fines');
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error loading fines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalFines = transactions.reduce((sum, t) => sum + (t.fineAmount || 0), 0);
  const paidFines = transactions
    .filter(t => t.finePaid)
    .reduce((sum, t) => sum + (t.fineAmount || 0), 0);
  const pendingFines = totalFines - paidFines;

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <h2>Fines Report</h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Fines Report</h2>
        
        {error && <div className="error-message">{error}</div>}

        {transactions.length === 0 ? (
          <div>No fines found.</div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#e3f2fd', borderRadius: '4px' }}>
              <h3>Summary</h3>
              <p><strong>Total Fines:</strong> ${totalFines}</p>
              <p><strong>Paid Fines:</strong> ${paidFines}</p>
              <p><strong>Pending Fines:</strong> ${pendingFines}</p>
            </div>

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
                      <td style={{ color: '#c62828', fontWeight: 'bold' }}>
                        ${transaction.fineAmount || 0}
                      </td>
                      <td>
                        <span style={{ 
                          color: transaction.finePaid ? '#2e7d32' : '#c62828',
                          fontWeight: 'bold'
                        }}>
                          {transaction.finePaid ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Fines;


