import React from 'react';
import '../../styles/AdminPage.css';

interface AccountProps {
  handleLogout: () => void;
}

const Account: React.FC<AccountProps> = ({ handleLogout }) => (
  <div className="login-box">
    <h2 className="admin-header">Account</h2>
    <button
      onClick={handleLogout}
      className="logout-button"
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c82333')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
    >
      Logout
    </button>
  </div>
);

export default Account;
