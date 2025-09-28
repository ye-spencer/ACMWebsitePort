import React from 'react';

interface PasswordModalProps {
  show: boolean;
  newPassword: string;
  confirmPassword: string;
  passwordError: string;
  onClose: () => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  show,
  newPassword,
  confirmPassword,
  passwordError,
  onClose,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="login-box modal-content">
        <h3 className="section-title">Change Password</h3>
        <div className="grid-gap-10">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            className="profile-input"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className="profile-input"
          />
          {passwordError && (
            <div className="member-message error">{passwordError}</div>
          )}
          <div className="modal-actions">
            <button className="login-button logout-button" onClick={onClose}>
              Cancel
            </button>
            <button className="login-button" onClick={onSubmit}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
