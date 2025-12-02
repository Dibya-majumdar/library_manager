import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatDate, calculateFine } from '../../utils/helpers';
import './Transactions.css';

const FinePay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transactionId: '',
    bookName: '',
    authorName: '',
    serialNo: '',
    issueDate: null,
    expectedReturnDate: null,
    actualReturnDate: null,
    fineAmount: 0,
    finePaid: false,
    remarks: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.transaction) {
      const transaction = location.state.transaction;
      const actualReturnDate = transaction.returnDate || transaction.actualReturnDate || new Date();
      const expectedReturnDate = transaction.expectedReturnDate || transaction.returnDate;
      const fineAmount = calculateFine(expectedReturnDate, actualReturnDate);
      
      setFormData({
        transactionId: transaction.transactionId,
        bookName: transaction.bookName,
        authorName: transaction.authorName,
        serialNo: transaction.serialNo,
        issueDate: transaction.issueDate,
        expectedReturnDate: expectedReturnDate,
        actualReturnDate: actualReturnDate,
        fineAmount: fineAmount,
        finePaid: fineAmount === 0,
        remarks: transaction.remarks || ''
      });
    } else {
      setError('No transaction data found. Please go back to Return Book.');
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.transactionId) {
      setError('Transaction ID is required.');
      return;
    }

    if (!formData.actualReturnDate) {
      setError('Return date is required.');
      return;
    }

    // If there's a fine, it must be paid
    if (formData.fineAmount > 0 && !formData.finePaid) {
      setError('Fine is pending. Please check the "Fine Paid" checkbox to complete the return.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/return-book', {
        transactionId: formData.transactionId,
        actualReturnDate: formatDate(formData.actualReturnDate),
        finePaid: formData.finePaid,
        remarks: formData.remarks
      });
      
      setSuccess('Book returned successfully! Transaction completed.');
      setTimeout(() => {
        navigate('/transactions/return-book');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error returning book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Fine Pay</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="expectedReturnDate">Expected Return Date: *</label>
            <input
              type="text"
              id="expectedReturnDate"
              name="expectedReturnDate"
              value={formatDate(formData.expectedReturnDate)}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="actualReturnDate">Actual Return Date: *</label>
            <input
              type="text"
              id="actualReturnDate"
              name="actualReturnDate"
              value={formatDate(formData.actualReturnDate)}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="fineAmount">Calculated Fine: *</label>
            <input
              type="text"
              id="fineAmount"
              name="fineAmount"
              value={formData.fineAmount > 0 ? `$${formData.fineAmount}` : 'No fine'}
              readOnly
              style={{ 
                color: formData.fineAmount > 0 ? '#c62828' : '#2e7d32',
                fontWeight: 'bold'
              }}
            />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="finePaid"
                name="finePaid"
                checked={formData.finePaid}
                onChange={handleChange}
                disabled={formData.fineAmount === 0}
              />
              <label htmlFor="finePaid">Fine Paid (checked = yes, unchecked = no)</label>
            </div>
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

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Processing...' : 'Complete Return'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinePay;

