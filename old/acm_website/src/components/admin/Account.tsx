import React from 'react';
import '../../styles/AdminPage.css';

interface AccountProps {
  handleLogout: () => void;
}

const Account: React.FC<AccountProps> = ({ handleLogout }) => (
  <>
    <h2 className="admin-header">Account</h2>
    <div className="admin-form">
      <button
        onClick={handleLogout}
        className="admin-btn secondary w-full"
      >
        Logout
      </button>
    </div>
  </>
);

export default Account;
