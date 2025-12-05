import React, { useState } from 'react';
import api from '../../services/api';
import './Maintenance.css';

const AddBook = () => {
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
    if (!formData.title || !formData.author || !formData.category || !formData.serialNo) {
      setError('All fields are mandatory. Please fill in all details.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/books', formData);
      setSuccess('Book added successfully!');
      setFormData({
        title: '',
        author: '',
        type: 'book',
        category: '',
        serialNo: '',
        status: 'available'
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Add Book</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

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
              placeholder="Enter book/movie title"
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
              placeholder="Enter author name"
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
              placeholder="Enter category"
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
              placeholder="Enter serial number"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Adding...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;



