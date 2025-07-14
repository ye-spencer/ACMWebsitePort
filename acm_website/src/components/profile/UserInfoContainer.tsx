import React from 'react';
import { Profile } from '../../types';

interface UserInfoProps {
  userData: Profile;
  memberError: string;
  memberSuccess: string;
  onBecomeMember: () => void;
  onToggleMailingList: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onChangePassword: () => void;
}

const UserInfoContainer: React.FC<UserInfoProps> = ({
  userData,
  memberError,
  memberSuccess,
  onBecomeMember,
  onToggleMailingList,
  onLogout,
  onDeleteAccount,
  onChangePassword,
}) => {
  return (
    <div className="page-section profile-section">
      <h2 className="section-title">Profile Information</h2>
      
      <div className="profile-info-sections">
        <div className="info-card">
          <div className="info-label">Account Email</div>
          <div className="info-value">{userData.email}</div>
        </div>

        <div className="info-card">
          <div className="info-label">ACM Membership</div>
          <div className="info-content">
            <div className="info-actions">
              <div className={`info-value ${userData.isMember ? 'status-active' : ''}`}>
                {userData.isMember ? 'Active Member' : 'Not a member'}
              </div>
              {!userData.isMember && (
                <button className="profile-btn primary" onClick={onBecomeMember}>
                  Become a Member
                </button>
              )}
            </div>
            {(memberError || memberSuccess) && (
              <div className={`member-message ${memberError ? 'error' : 'success'}`}>
                {memberError || memberSuccess}
              </div>
            )}
          </div>
        </div>

        <div className="info-card">
          <div className="info-label">Mailing List</div>
          <div className="info-actions">
            <div className="info-value">
              {userData.isOnMailingList ? 'Subscribed' : 'Not subscribed'}
            </div>
            <button className="profile-btn secondary" onClick={onToggleMailingList}>
              {userData.isOnMailingList ? 'Unsubscribe' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <h3 className="actions-title">Account Management</h3>
        <div className="actions-grid">
          <button className="profile-btn primary" onClick={onChangePassword}>
            Change Password
          </button>
          <button className="profile-btn secondary" onClick={onLogout}>
            Logout
          </button>
          <button className="profile-btn danger" onClick={onDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoContainer;
