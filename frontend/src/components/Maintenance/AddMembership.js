import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Maintenance.css';

const AddMembership = () => {
  const [formData, setFormData] = useState({
    userId: '',
    type: '6months'
  });
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data || []);
      } catch (err) {
        // If unauthorized or no users, keep users empty
        console.error('Could not fetch users for dropdown', err.message || err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.userId || !formData.type) {
      setError('All fields are mandatory. Please fill in all details.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/membership', formData);
      setSuccess(`Membership created successfully! Membership Number: ${response.data.membership.membershipNumber}`);
      setFormData({
        userId: '',
        type: '6months'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating membership. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Add Membership</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">Select User: *</label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select user --</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contactName">Contact Name:</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName || ''}
              onChange={handleChange}
              placeholder="Enter contact name (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="aadhar">Aadhaar Card No:</label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              value={formData.aadhar || ''}
              onChange={handleChange}
              placeholder="Enter Aadhaar number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Enter contact address"
            />
          </div>

          <div className="form-group">
            <label>Membership Duration: *</label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  name="type"
                  value="6months"
                  checked={formData.type === '6months'}
                  onChange={handleChange}
                />
                <label>6 Months</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  name="type"
                  value="1year"
                  checked={formData.type === '1year'}
                  onChange={handleChange}
                />
                <label>1 Year</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  name="type"
                  value="2years"
                  checked={formData.type === '2years'}
                  onChange={handleChange}
                />
                <label>2 Years</label>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating...' : 'Create Membership'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMembership;







