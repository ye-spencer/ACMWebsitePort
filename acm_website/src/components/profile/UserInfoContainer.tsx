import React from 'react';

interface UserInfoProps {
  email: string;
  isMember: boolean;
  isOnMailingList: boolean;
  memberError: string;
  memberSuccess: string;
  onBecomeMember: () => void;
  onJoinMailingList: () => void;
  onUnsubscribeMailingList: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onChangePassword: () => void;
}

const UserInfoContainer: React.FC<UserInfoProps> = ({
  email,
  isMember,
  isOnMailingList,
  memberError,
  memberSuccess,
  onBecomeMember,
  onJoinMailingList,
  onUnsubscribeMailingList,
  onLogout,
  onDeleteAccount,
  onChangePassword,
}) => {
  return (
    <div className="login-box profile-section">
      <h2 className="section-title-small">Profile Information</h2>
      <div className="profile-info-grid">
        <div>
          <strong>Email:</strong> {email}
        </div>
        <div>
          <strong>ACM Member:</strong>{' '}
          {isMember ? (
            'Yes'
          ) : (
            <button className="login-button" onClick={onBecomeMember}>
              Become a Member
            </button>
          )}
          {(memberError || memberSuccess) && (
            <div
              className={`member-message ${memberError ? 'error' : 'success'}`}
            >
              {memberError || memberSuccess}
            </div>
          )}
        </div>
        <div>
          <strong>Mailing List:</strong>{' '}
          {isOnMailingList ? (
            <>
              <button className="login-button" onClick={onUnsubscribeMailingList}>
                Unsubscribe
              </button>
            </>
          ) : (
            <button className="login-button" onClick={onJoinMailingList}>
              Subscribe
            </button>
          )}
        </div>
        <div className="profile-buttons">
          <button className="login-button" onClick={onChangePassword}>
            Change Password
          </button>
          <button className="login-button logout-button" onClick={onLogout}>
            Logout
          </button>
          <button className="login-button delete-account-button" onClick={onDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoContainer;
