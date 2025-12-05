import React, { useState } from 'react';
import api from '../../services/api';
import './Maintenance.css';

const UserManagement = () => {
  const [userType, setUserType] = useState('new');
  const [searchId, setSearchId] = useState('');
  const [user, setUser] = useState(null);
  
  // New user form
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });
  
  // Update user form
  const [updateUserData, setUpdateUserData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) {
      setError('Please enter a user ID');
      return;
    }

    setError('');
    setSuccess('');
    setSearchLoading(true);

    try {
      const response = await api.get(`/addUser/${searchId}`);
      const userData = response.data;
      setUser(userData);
      setUpdateUserData({
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
    } catch (err) {
      setError(err.response?.data?.message || 'User not found');
      setUser(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUserChange = (e) => {
    const { name, value } = e.target;
    setUpdateUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!newUserData.name || !newUserData.email || !newUserData.role || !newUserData.password) {
      setError('All fields are mandatory. Please fill in all details.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/addUser', newUserData);
      setSuccess('User created successfully!');
      setNewUserData({
        name: '',
        email: '',
        role: 'user',
        password: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Please search for a user first');
      return;
    }

    // Validation
    if (!updateUserData.name || !updateUserData.email || !updateUserData.role) {
      setError('All fields are mandatory. Please fill in all details.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/addUser/${user._id}`, updateUserData);
      setSuccess('User updated successfully!');
      
      // Reload user data
      const response = await api.get(`/addUser/${user._id}`);
      setUser(response.data);
      setUpdateUserData({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>User Management</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label>User Type: *</label>
          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                name="userType"
                value="new"
                checked={userType === 'new'}
                onChange={(e) => {
                  setUserType(e.target.value);
                  setUser(null);
                  setError('');
                  setSuccess('');
                }}
              />
              <label>New User</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                name="userType"
                value="existing"
                checked={userType === 'existing'}
                onChange={(e) => {
                  setUserType(e.target.value);
                  setUser(null);
                  setError('');
                  setSuccess('');
                }}
              />
              <label>Existing User</label>
            </div>
          </div>
        </div>

        {userType === 'new' ? (
          <form onSubmit={handleNewUserSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name: *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newUserData.name}
                onChange={handleNewUserChange}
                required
                placeholder="Enter user name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email: *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUserData.email}
                onChange={handleNewUserChange}
                required
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role: *</label>
              <select
                id="role"
                name="role"
                value={newUserData.role}
                onChange={handleNewUserChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password: *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={newUserData.password}
                onChange={handleNewUserChange}
                required
                placeholder="Enter password"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        ) : (
          <div>
            <form onSubmit={handleSearch} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '2px solid #ddd' }}>
              <div className="form-group">
                <label htmlFor="searchId">Search by User ID: *</label>
                <input
                  type="text"
                  id="searchId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  required
                  placeholder="Enter user ID"
                />
              </div>
              <button type="submit" disabled={searchLoading} className="submit-btn">
                {searchLoading ? 'Searching...' : 'Search User'}
              </button>
            </form>

            {user && (
              <div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
                  <p><strong>User ID:</strong> {user._id}</p>
                  <p><strong>Current Name:</strong> {user.name}</p>
                  <p><strong>Current Email:</strong> {user.email}</p>
                  <p><strong>Current Role:</strong> {user.role}</p>
                </div>

                <form onSubmit={handleUpdateUserSubmit}>
                  <div className="form-group">
                    <label htmlFor="updateName">Name: *</label>
                    <input
                      type="text"
                      id="updateName"
                      name="name"
                      value={updateUserData.name}
                      onChange={handleUpdateUserChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="updateEmail">Email: *</label>
                    <input
                      type="email"
                      id="updateEmail"
                      name="email"
                      value={updateUserData.email}
                      onChange={handleUpdateUserChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="updateRole">Role: *</label>
                    <select
                      id="updateRole"
                      name="role"
                      value={updateUserData.role}
                      onChange={handleUpdateUserChange}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Updating...' : 'Update User'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;



