import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Transactions.css';

const BookAvailable = () => {
  const [searchType, setSearchType] = useState('title');
  const [searchValue, setSearchValue] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books');
      setBooks(response.data);
      setFilteredBooks(response.data.filter(book => book.status === 'available'));
    } catch (err) {
      setError('Error loading books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setSelectedBook(null);

    if (!searchValue.trim()) {
      setError('Please enter either a title or author name to search.');
      return;
    }

    const filtered = books.filter(book => {
      if (book.status !== 'available') return false;
      
      if (searchType === 'title') {
        return book.title.toLowerCase().includes(searchValue.toLowerCase());
      } else {
        return book.author.toLowerCase().includes(searchValue.toLowerCase());
      }
    });

    if (filtered.length === 0) {
      setError('No available books found matching your search criteria.');
    }

    setFilteredBooks(filtered);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book._id);
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Book Available</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Search By: *</label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  name="searchType"
                  value="title"
                  checked={searchType === 'title'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                <label>Title</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  name="searchType"
                  value="author"
                  checked={searchType === 'author'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                <label>Author</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="searchValue">
              {searchType === 'title' ? 'Book Title:' : 'Author Name:'} *
            </label>
            <input
              type="text"
              id="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={`Enter ${searchType === 'title' ? 'book title' : 'author name'}`}
            />
          </div>

          <button type="submit" className="submit-btn">
            Search
          </button>
        </form>

        {loading ? (
          <div>Loading books...</div>
        ) : filteredBooks.length > 0 ? (
          <div className="table-container">
            <h3>Search Results</h3>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Serial No</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.type}</td>
                    <td>{book.category}</td>
                    <td>{book.serialNo}</td>
                    <td>
                      <input
                        type="radio"
                        name="selectedBook"
                        checked={selectedBook === book._id}
                        onChange={() => handleBookSelect(book)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedBook && (
              <div className="success-message" style={{ marginTop: '1rem' }}>
                Book selected. You can now proceed to Book Issue.
              </div>
            )}
          </div>
        ) : searchValue && (
          <div className="error-message">
            No available books found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAvailable;

