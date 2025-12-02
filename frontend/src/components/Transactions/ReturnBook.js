import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import api from '../../services/api';
import { formatDate, calculateFine } from '../../utils/helpers';
import './Transactions.css';

const ReturnBook = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    transactionId: '',
    bookName: '',
    authorName: '',
    serialNo: '',
    issueDate: null,
    returnDate: null,
    remarks: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Try to get user transactions if userId is available
    // For now, we'll use a search approach
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!userId) {
      setError('Please enter User ID to search for issued books.');
      return;
    }

    setSearchLoading(true);
    try {
      // Try to get issued books - this endpoint is admin-only, but we'll try
      // In a production system, you'd want a user-specific endpoint
      const response = await api.get('/issued-books');
      const userTransactions = response.data.filter(t => {
        const transactionUserId = t.userId?._id || t.userId?.toString() || t.userId;
        return transactionUserId === userId || transactionUserId.toString() === userId;
      });
      
      if (userTransactions.length === 0) {
        setError('No issued books found for this user.');
        setTransactions([]);
      } else {
        setTransactions(userTransactions);
      }
    } catch (err) {
      // If admin endpoint fails (403), show appropriate message
      if (err.response?.status === 403) {
        setError('Access denied. Admin access required to view all transactions. Please contact administrator.');
      } else {
        setError('Unable to fetch transactions. Please try again or contact administrator.');
      }
      setTransactions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction);
    const issueDate = new Date(transaction.issueDate);
    const expectedReturnDate = new Date(transaction.expectedReturnDate);
    
    setFormData({
      transactionId: transaction._id,
      bookName: transaction.bookName,
      authorName: transaction.authorName,
      serialNo: transaction.serialNo,
      issueDate: issueDate,
      returnDate: expectedReturnDate,
      remarks: transaction.remarks || ''
    });
  };

  const handleReturnDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      returnDate: date
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirm = () => {
    setError('');

    // Validation
    if (!formData.bookName) {
      setError('Book name is required.');
      return;
    }

    if (!formData.serialNo) {
      setError('Serial number is mandatory.');
      return;
    }

    if (!formData.issueDate) {
      setError('Issue date is required.');
      return;
    }

    if (!formData.returnDate) {
      setError('Return date is required.');
      return;
    }

    // Calculate fine and navigate to Fine Pay page
    const expectedReturnDate = selectedTransaction.expectedReturnDate || formData.returnDate;
    const fineAmount = calculateFine(expectedReturnDate, formData.returnDate);
    
    navigate('/transactions/fine-pay', {
      state: {
        transaction: {
          ...formData,
          expectedReturnDate: expectedReturnDate,
          fineAmount: fineAmount
        }
      }
    });
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Return Book</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSearch} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '2px solid #ddd' }}>
          <div className="form-group">
            <label htmlFor="userId">User ID: *</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              placeholder="Enter user ID to find issued books"
            />
          </div>
          <button type="submit" disabled={searchLoading} className="submit-btn">
            {searchLoading ? 'Searching...' : 'Search Issued Books'}
          </button>
        </form>

        {transactions.length > 0 && (
          <div className="table-container" style={{ marginBottom: '2rem' }}>
            <h3>Issued Books</h3>
            <table>
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Issue Date</th>
                  <th>Expected Return Date</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.bookName}</td>
                    <td>{transaction.authorName}</td>
                    <td>{formatDate(transaction.issueDate)}</td>
                    <td>{formatDate(transaction.expectedReturnDate)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleTransactionSelect(transaction)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTransaction && (
          <form>
            <div className="form-group">
              <label htmlFor="bookName">Book Name: *</label>
              <input
                type="text"
                id="bookName"
                name="bookName"
                value={formData.bookName}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="authorName">Author Name: *</label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="serialNo">Serial Number: *</label>
              <input
                type="text"
                id="serialNo"
                name="serialNo"
                value={formData.serialNo}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="issueDate">Issue Date: *</label>
              <input
                type="text"
                id="issueDate"
                name="issueDate"
                value={formatDate(formData.issueDate)}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="returnDate">Return Date: *</label>
              <DatePicker
                id="returnDate"
                selected={formData.returnDate}
                onChange={handleReturnDateChange}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="remarks">Remarks:</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Optional remarks"
              />
            </div>

            <button type="button" onClick={handleConfirm} className="submit-btn">
              Confirm
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReturnBook;

