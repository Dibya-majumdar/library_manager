import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Maintenance.css';

const UpdateBook = () => {
  const [searchId, setSearchId] = useState('');
  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    type: 'book',
    category: '',
    serialNo: '',
    status: 'available',
    cost: '',
    quantity: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    // With dropdown UI we don't need search by ID submission.
    // Keep handler present but simply prevent default.
    return;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        setBooks(res.data || []);
      } catch (err) {
        console.error('Failed to fetch books for dropdown', err.message || err);
      }
    };

    fetchBooks();
  }, []);

  const handleSelect = (e) => {
    const id = e.target.value;
    if (!id) {
      setBook(null);
      return;
    }

    const selected = books.find(b => b._id === id);
    if (selected) {
      setBook(selected);
      setFormData({
        title: selected.title,
        author: selected.author,
        type: selected.type,
        category: selected.category,
        serialNo: selected.serialNo,
        status: selected.status,
          cost: selected.cost || '',
          quantity: typeof selected.quantity !== 'undefined' ? selected.quantity : 1
      });
    } else {
      // fallback to fetching single book
      api.get(`/books/${id}`).then(res => {
        const bookData = res.data;
        setBook(bookData);
        setFormData({
          title: bookData.title,
          author: bookData.author,
          type: bookData.type,
          category: bookData.category,
          serialNo: bookData.serialNo,
          status: bookData.status,
            cost: bookData.cost || '',
            quantity: typeof bookData.quantity !== 'undefined' ? bookData.quantity : 1
        });
      }).catch(err => {
        setError(err.response?.data?.msg || 'Book not found');
        setBook(null);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!book) {
      setError('Please search for a book first');
      return;
    }

    // Validation
    if (!formData.title || !formData.author || !formData.category || !formData.serialNo || !formData.cost) {
      setError('All fields are mandatory. Please fill in all details.');
      return;
    }

    // Validate cost is a positive number
    if (isNaN(formData.cost) || parseFloat(formData.cost) < 0) {
      setError('Cost must be a valid positive number.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/books/${book._id}`, formData);
      setSuccess('Book updated successfully!');
      // Reload book data
      const response = await api.get(`/books/${book._id}`);
      setBook(response.data);
      setFormData({
        title: response.data.title,
        author: response.data.author,
        type: response.data.type,
        category: response.data.category,
        serialNo: response.data.serialNo,
        status: response.data.status,
        cost: response.data.cost || '',
        quantity: typeof response.data.quantity !== 'undefined' ? response.data.quantity : 1
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Update Book</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSearch} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '2px solid #ddd' }}>
          <div className="form-group">
            <label htmlFor="searchId">Select Book to Update: *</label>
            <select id="searchId" value={book?._id || ''} onChange={handleSelect} required>
              <option value="">-- Select book --</option>
              {books.map(b => (
                <option key={b._id} value={b._id}>{b.title} — {b.serialNo}</option>
              ))}
            </select>
          </div>
        </form>

        {book && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type: *</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    name="type"
                    value="book"
                    checked={formData.type === 'book'}
                    onChange={handleChange}
                  />
                  <label>Book</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    name="type"
                    value="movie"
                    checked={formData.type === 'movie'}
                    onChange={handleChange}
                  />
                  <label>Movie</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title">Title: *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author: *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category: *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="serialNo">Serial Number: *</label>
              <input
                type="text"
                id="serialNo"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cost">Cost: *</label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter cost"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity / Copies: *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                step="1"
                placeholder="Enter number of copies"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status: *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="available">Available</option>
                <option value="issued">Issued</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Updating...' : 'Update Book'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateBook;




