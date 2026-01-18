import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import './Reports.css';

const MasterListMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    try {
      setLoading(true);
      const response = await api.get('/memberships');
      setMemberships(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading memberships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="form-container">
          <h2>Master List of Memberships</h2>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Master List of Memberships</h2>
        
        {error && <div className="error-message">{error}</div>}

        {memberships.length === 0 ? (
          <div>No memberships found.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Membership Id</th>
                  <th>Name of Member</th>
                  <th>Contact Number</th>
                  <th>Contact Address</th>
                  <th>Aadhar Card No</th>
                  <th>Start Date of Membership</th>
                  <th>End Date of Membership</th>
                  <th>Status (Active/Inactive)</th>
                  <th>Amount Pending(Fine)</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((membership) => (
                  <tr key={membership._id}>
                    <td>{membership.membershipNumber}</td>
                    <td>{membership.userId?.name || 'N/A'}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{formatDate(membership.startDate)}</td>
                    <td>{formatDate(membership.endDate)}</td>
                    <td>{membership.status}</td>
                    <td>-</td>
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

export default MasterListMemberships;




