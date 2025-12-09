import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Reports.css';

const MasterListBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/master-list-books');
      setBooks(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error loading books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <h2>Master List of Books</h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Master List of Books</h2>
        
        {error && <div className="error-message">{error}</div>}

        {books.length === 0 ? (
          <div>No books found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Name of Book</th>
                  <th>Author Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Cost</th>
                  <th>Procurement Date</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.serialNo}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.status}</td>
                    <td>${book.cost || 0}</td>
                    <td>{formatDate(book.createdAt)}</td>
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

export default MasterListBooks;

