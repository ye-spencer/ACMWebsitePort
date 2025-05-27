import React from 'react';

interface VerifyPasswordModalProps {
  show: boolean;
  currentPassword: string;
  passwordError: string;
  onClose: () => void;
  onCurrentPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

const VerifyPasswordModal: React.FC<VerifyPasswordModalProps> = ({
  show,
  currentPassword,
  passwordError,
  onClose,
  onCurrentPasswordChange,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="login-box modal-content">
        <h3 className="section-title">Verify Current Password</h3>
        <div className="grid-gap-10">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
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
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPasswordModal; 