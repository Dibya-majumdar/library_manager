import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getReturnDate, isDateValid, isReturnDateValid } from '../../utils/helpers';
import './Transactions.css';

const BookIssue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    bookId: '',
    bookName: '',
    authorName: '',
    userId: '',
    issueDate: new Date(),
    returnDate: null,
    remarks: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    loadBooks();
    loadCurrentUser();
    
    // If admin, load all users for dropdown
    if (isAdmin()) {
      loadUsers();
    }
    
    // If coming from Book Available with selected book
    if (location.state?.selectedBook) {
      const book = location.state.selectedBook;
      setFormData(prev => ({
        ...prev,
        bookId: book._id,
        bookName: book.title,
        authorName: book.author,
        returnDate: getReturnDate(new Date())
      }));
    }
  }, [location, isAdmin]);

  const loadCurrentUser = async () => {
    try {
      const response = await api.get('/me');
      setCurrentUser(response.data);
      // Auto-populate user ID for regular users
      if (!isAdmin() && response.data) {
        setFormData(prev => ({
          ...prev,
          userId: response.data._id
        }));
      }
    } catch (err) {
      console.error('Error loading current user:', err);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Error loading users. Please try again.');
    } finally {
      setUsersLoading(false);
    }
  };

  const loadBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data.filter(book => book.status === 'available'));
    } catch (err) {
      setError('Error loading books. Please try again.');
    }
  };

  const handleBookChange = (e) => {
    const bookId = e.target.value;
    const selectedBook = books.find(b => b._id === bookId);
    
    if (selectedBook) {
      setFormData(prev => ({
        ...prev,
        bookId: selectedBook._id,
        bookName: selectedBook.title,
        authorName: selectedBook.author,
        returnDate: getReturnDate(new Date())
      }));
    }
  };

  const handleIssueDateChange = (date) => {
    const issueDate = date || new Date();
    setFormData(prev => ({
      ...prev,
      issueDate: issueDate,
      returnDate: getReturnDate(issueDate)
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.bookName || !formData.bookId) {
      setError('Book name is required. Please select a book.');
      return;
    }

    if (!formData.userId) {
      setError('User ID is required.');
      return;
    }

    if (!formData.issueDate) {
      setError('Issue date is required.');
      return;
    }

    if (!isDateValid(formData.issueDate)) {
      setError('Issue date cannot be less than today.');
      return;
    }

    if (!formData.returnDate) {
      setError('Return date is required.');
      return;
    }

    if (!isReturnDateValid(formData.issueDate, formData.returnDate)) {
      setError('Return date cannot be more than 15 days from issue date.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/issue-book', {
        userId: formData.userId,
        bookId: formData.bookId,
        remarks: formData.remarks
      });
      setSuccess('Book issued successfully!');
      setTimeout(() => {
        navigate('/transactions/book-available');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error issuing book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Book Issue</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="bookId">Book Name: *</label>
            <select
              id="bookId"
              name="bookId"
              value={formData.bookId}
              onChange={handleBookChange}
              required
            >
              <option value="">Select a book</option>
              {books.map(book => (
                <option key={book._id} value={book._id}>
                  {book.title} - {book.author}
                </option>
              ))}
            </select>
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
            <label htmlFor="userId">
              {isAdmin() ? 'Select User: *' : 'User: *'}
            </label>
            {isAdmin() ? (
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                disabled={usersLoading}
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  type="text"
                  id="userIdDisplay"
                  value={currentUser ? `${currentUser.name} (${currentUser.email})` : 'Loading...'}
                  readOnly
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
                <input
                  type="hidden"
                  name="userId"
                  value={formData.userId}
                />
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="issueDate">Issue Date: *</label>
            <DatePicker
              id="issueDate"
              selected={formData.issueDate}
              onChange={handleIssueDateChange}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="returnDate">Return Date: *</label>
            <DatePicker
              id="returnDate"
              selected={formData.returnDate}
              onChange={handleReturnDateChange}
              minDate={formData.issueDate}
              maxDate={new Date(new Date(formData.issueDate).setDate(new Date(formData.issueDate).getDate() + 15))}
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

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Issuing...' : 'Issue Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookIssue;

