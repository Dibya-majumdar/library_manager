import React, { useState } from 'react';
import api from '../../services/api';
import './Maintenance.css';

const UpdateMembership = () => {
  const [membershipNumber, setMembershipNumber] = useState('');
  const [membership, setMembership] = useState(null);
  const [formData, setFormData] = useState({
    type: '6months',
    status: 'active'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!membershipNumber) {
      setError('Please enter a membership number');
      return;
    }

    setError('');
    setSuccess('');
    setSearchLoading(true);

    try {
      const response = await api.get(`/membership/${membershipNumber}`);
      const membershipData = response.data;
      setMembership(membershipData);
      setFormData({
        type: membershipData.type,
        status: membershipData.status
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Membership not found');
      setMembership(null);
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

    if (!membership) {
      setError('Please search for a membership first');
      return;
    }

    setLoading(true);
    try {
      const updateData = {};
      
      // If extending membership, calculate new end date
      if (formData.type !== membership.type) {
        updateData.type = formData.type;
      }
      
      if (formData.status !== membership.status) {
        updateData.status = formData.status;
      }

      const response = await api.put(`/membership/${membershipNumber}`, updateData);
      setSuccess('Membership updated successfully!');
      
      // Reload membership data
      const updatedResponse = await api.get(`/membership/${membershipNumber}`);
      setMembership(updatedResponse.data);
      setFormData({
        type: updatedResponse.data.type,
        status: updatedResponse.data.status
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating membership. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Update Membership</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSearch} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '2px solid #ddd' }}>
          <div className="form-group">
            <label htmlFor="membershipNumber">Membership Number: *</label>
            <input
              type="text"
              id="membershipNumber"
              value={membershipNumber}
              onChange={(e) => setMembershipNumber(e.target.value)}
              required
              placeholder="Enter membership number"
            />
          </div>
          <button type="submit" disabled={searchLoading} className="submit-btn">
            {searchLoading ? 'Searching...' : 'Search Membership'}
          </button>
        </form>

        {membership && (
          <div>
            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
              <p><strong>User ID:</strong> {membership.userId}</p>
              <p><strong>Start Date:</strong> {new Date(membership.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(membership.endDate).toLocaleDateString()}</p>
              <p><strong>Current Status:</strong> {membership.status}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Extend Membership Duration: *</label>
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

              <div className="form-group">
                <label htmlFor="status">Status: *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancel</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Updating...' : 'Update Membership'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateMembership;







