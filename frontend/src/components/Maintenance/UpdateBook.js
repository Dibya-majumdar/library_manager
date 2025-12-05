import React, { useState } from 'react';
import api from '../../services/api';
import './Maintenance.css';

const UpdateBook = () => {
  const [searchId, setSearchId] = useState('');
  const [book, setBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    type: 'book',
    category: '',
    serialNo: '',
    status: 'available'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) {
      setError('Please enter a book ID');
      return;
    }

    setError('');
    setSuccess('');
    setSearchLoading(true);

    try {
      const response = await api.get(`/books/${searchId}`);
      const bookData = response.data;
      setBook(bookData);
      setFormData({
        title: bookData.title,
        author: bookData.author,
        type: bookData.type,
        category: bookData.category,
        serialNo: bookData.serialNo,
        status: bookData.status
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Book not found');
      setBook(null);
    } finally {
      setSearchLoading(false);
    }
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

    if (!book) {
      setError('Please search for a book first');
      return;
    }

    // Validation
    if (!formData.title || !formData.author || !formData.category || !formData.serialNo) {
      setError('All fields are mandatory. Please fill in all details.');
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
        status: response.data.status
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
            <label htmlFor="searchId">Search by Book ID: *</label>
            <input
              type="text"
              id="searchId"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              required
              placeholder="Enter book ID"
            />
          </div>
          <button type="submit" disabled={searchLoading} className="submit-btn">
            {searchLoading ? 'Searching...' : 'Search Book'}
          </button>
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



