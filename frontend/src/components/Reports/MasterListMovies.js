import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Reports.css';

const MasterListMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/master-list-movies');
      setMovies(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error loading movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <h2>Master List of Movies</h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Master List of Movies</h2>
        
        {error && <div className="error-message">{error}</div>}

        {movies.length === 0 ? (
          <div>No movies found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Name of Movie</th>
                  <th>Author Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Cost</th>
                  <th>Procurement Date</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie._id}>
                    <td>{movie.serialNo}</td>
                    <td>{movie.title}</td>
                    <td>{movie.author}</td>
                    <td>{movie.category}</td>
                    <td>{movie.status}</td>
                    <td>${movie.cost || 0}</td>
                    <td>{formatDate(movie.createdAt)}</td>
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

export default MasterListMovies;

