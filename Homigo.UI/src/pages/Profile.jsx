import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProfile,
  updateProfile,
  changePassword,
  deleteMyAccount,
} from "../services/profileService";

import "./Profile.css";

const API_URL = "https://localhost:7121";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProfile();

      setProfile(data);

      setFullName(data.fullName || "");
      setEmail(data.email || "");
      setPhoneNumber(data.phoneNumber || "");

      if (data.profileImageUrl) {
        setPreview(`${API_URL}${data.profileImageUrl}`);
      } else {
        setPreview("");
      }
    } catch (err) {
      console.error("PROFILE ERROR:", err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("FullName", fullName);
      formData.append("Email", email);
      formData.append("PhoneNumber", phoneNumber);

      if (selectedFile) {
        formData.append("ProfileImage", selectedFile);
      }

      const updatedProfile = await updateProfile(formData);

      setProfile(updatedProfile);

      setFullName(updatedProfile.fullName || "");
      setEmail(updatedProfile.email || "");
      setPhoneNumber(updatedProfile.phoneNumber || "");

      if (updatedProfile.profileImageUrl) {
        setPreview(`${API_URL}${updatedProfile.profileImageUrl}`);
      }

      setSelectedFile(null);

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;

    setFullName(profile.fullName || "");
    setEmail(profile.email || "");
    setPhoneNumber(profile.phoneNumber || "");

    setSelectedFile(null);

    if (profile.profileImageUrl) {
      setPreview(`${API_URL}${profile.profileImageUrl}`);
    } else {
      setPreview("");
    }

    setMessage("");
    setError("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!currentPassword || !newPassword) {
      setError("Please enter both passwords.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError(
        "New password must contain an uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setError(
        "New password must contain a lowercase letter."
      );
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError(
        "New password must contain a number."
      );
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError(
        "New password must contain a special character."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      setMessage("Password changed successfully.");
    } catch (err) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        err
      );

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to change password.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

 const handleDeleteAccount = async () => {
  try {
    setDeletingAccount(true);
    setError("");

    await deleteMyAccount();

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  } catch (err) {
    console.error("DELETE ACCOUNT ERROR:", err);

    setError(
      err.response?.data?.message ||
        "Failed to delete account."
    );
  } finally {
    setDeletingAccount(false);
    setShowDeleteModal(false);
  }
};

  const passwordRequirements = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-top">

        <div>

          <div className="breadcrumb">
            Home <span>/</span> Profile
          </div>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and account settings
          </p>

        </div>

        <button
          className="refresh-button"
          onClick={loadProfile}
        >
          ↻ <span>Refresh</span>
        </button>

      </div>


      {/* MESSAGES */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          ✕ {error}
        </div>
      )}


      {/* PROFILE INFORMATION */}

      <section className="profile-card">

        <div className="profile-left">

          {/* PROFILE IMAGE */}

          <div className="avatar-wrapper">

            {preview ? (

              <img
                src={preview}
                alt="Profile"
                className="profile-avatar"
              />

            ) : (

              <div className="profile-avatar avatar-placeholder">
                {fullName?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>

            )}

            <button
              type="button"
              className="camera-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              📷
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />

          </div>


          <h2>
            {fullName || "User"}
          </h2>

          <p className="account-role">
            {profile?.roleName ||
              profile?.role ||
              "Customer"}
          </p>


          <div className="member-box">

            <div className="member-icon">
              ▣
            </div>

            <div>
              <span>Member since</span>
              <strong>August 2025</strong>
            </div>

          </div>

        </div>


        <div className="profile-divider"></div>


        {/* PROFILE FORM */}

        <div className="profile-right">

          <div className="section-heading">

            <h2>Profile Information</h2>

            <p>
              Update your personal information
            </p>

          </div>


          <form onSubmit={handleSaveProfile}>

            {/* FULL NAME */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ♙
                </span>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Enter your full name"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="form-group">

  <label>
    Phone Number
  </label>

  <div className="input-wrapper">

    <span className="input-icon">
      ☎
    </span>

    <span
      style={{
        paddingRight: "8px",
        color: "#64748b",
        fontWeight: "500",
      }}
    >
      +994
    </span>

    <input
      type="text"
      value={phoneNumber}
      onChange={(e) =>
        setPhoneNumber(e.target.value)
      }
      placeholder="XX XXX XX XX"
      maxLength={9}
    />

  </div>

</div>


            <p className="profile-note">
              You can update your profile information
              and profile picture.
            </p>


            <div className="profile-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                ✕ &nbsp; Cancel
              </button>

              <button
                type="submit"
                className="save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "▣  Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </section>


      {/* CHANGE PASSWORD */}

      <section className="password-card">

        <div className="password-header">

          <div className="password-icon">
            🔒
          </div>

          <div>

            <h2>
              Change Password
            </h2>

            <p>
              Update your password to keep your account secure
            </p>

          </div>

        </div>


        <div className="password-line"></div>


        <form onSubmit={handleChangePassword}>

          {/* CURRENT PASSWORD */}

          <div className="password-group">

            <label>
              Current Password
            </label>

            <div className="password-input">

              <span>
                🔒
              </span>

              <input
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword
                  )
                }
              >
                ◉
              </button>

            </div>

          </div>


          {/* NEW PASSWORD */}

          <div className="password-group">

            <label>
              New Password
            </label>

            <div className="password-input">

              <span>
                🔒
              </span>

              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
              >
                ◉
              </button>

            </div>

          </div>


          {/* PASSWORD REQUIREMENTS */}

          <div className="requirements">

            <h3>
              Password requirements:
            </h3>

            <div className="requirements-grid">

              <Requirement
                valid={
                  passwordRequirements.length
                }
                text="At least 8 characters"
              />

              <Requirement
                valid={
                  passwordRequirements.number
                }
                text="At least one number"
              />

              <Requirement
                valid={
                  passwordRequirements.uppercase
                }
                text="At least one uppercase letter"
              />

              <Requirement
                valid={
                  passwordRequirements.special
                }
                text="At least one special character"
              />

              <Requirement
                valid={
                  passwordRequirements.lowercase
                }
                text="At least one lowercase letter"
              />

            </div>

          </div>


          <button
            type="submit"
            className="change-password-button"
            disabled={changingPassword}
          >
            🔒 &nbsp;

            {changingPassword
              ? "Changing..."
              : "Change Password"}
          </button>

        </form>

      </section>


      {/* DELETE ACCOUNT */}
      <section
        style={{
          marginTop: "28px",
          marginBottom: "30px",
          padding: "24px 28px",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          background: "#ffffff",
          border: "1px solid #f1d5d5",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* DELETE ICON */}
        <div
          style={{
            width: "48px",
            height: "48px",
            minWidth: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff1f1",
            borderRadius: "12px",
            fontSize: "21px",
          }}
        >
          🗑️
        </div>

        {/* TEXT */}
        <div style={{ flex: 1 }}>
          <h2
            style={{
              margin: "0 0 6px 0",
              fontSize: "18px",
              fontWeight: "600",
              color: "#1f2937",
            }}
          >
            Delete Account
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#7b8494",
            }}
          >
            Permanently delete your Homigo account and all associated
            data. This action cannot be undone.
          </p>
        </div>

        {/* DELETE BUTTON */}
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          disabled={deletingAccount}
          style={{
            flexShrink: 0,
            padding: "11px 18px",
            border: "1px solid #dc2626",
            borderRadius: "9px",
            background: "#ffffff",
            color: "#dc2626",
            fontSize: "14px",
            fontWeight: "600",
            cursor: deletingAccount ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
            opacity: deletingAccount ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!deletingAccount) {
              e.currentTarget.style.background = "#dc2626";
              e.currentTarget.style.color = "#ffffff";
            }
          }}
          onMouseLeave={(e) => {
            if (!deletingAccount) {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.color = "#dc2626";
            }
          }}
        >
          {deletingAccount ? "Deleting..." : "Delete My Account"}
        </button>
      </section>


      {/* DELETE ACCOUNT MODAL */}
      {showDeleteModal && (
        <div
          onClick={() => {
            if (!deletingAccount) {
              setShowDeleteModal(false);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "32px",
              boxSizing: "border-box",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25)",
              textAlign: "center",
            }}
          >
            {/* MODAL ICON */}
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff1f1",
                borderRadius: "50%",
                fontSize: "28px",
              }}
            >
              🗑️
            </div>

            {/* TITLE */}
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "22px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Delete Account?
            </h2>

            {/* DESCRIPTION */}
            <p
              style={{
                margin: "0 auto 28px",
                maxWidth: "380px",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#6b7280",
              }}
            >
              Are you sure you want to delete your Homigo account?
              <br />
              All your account data will be permanently deleted.
              <br />
              <strong style={{ color: "#dc2626" }}>
                This action cannot be undone.
              </strong>
            </p>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              {/* CANCEL */}
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingAccount}
                style={{
                  minWidth: "120px",
                  padding: "12px 20px",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  background: "#ffffff",
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: deletingAccount
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                Cancel
              </button>

              {/* CONFIRM DELETE */}
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                style={{
                  minWidth: "140px",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#dc2626",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: deletingAccount
                    ? "not-allowed"
                    : "pointer",
                  opacity: deletingAccount ? 0.7 : 1,
                }}
              >
                {deletingAccount
                  ? "Deleting..."
                  : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


function Requirement({ valid, text }) {
  return (
    <div
      className={`requirement ${
        valid ? "valid" : ""
      }`}
    >
      <span>
        {valid ? "✓" : "○"}
      </span>

      {text}
    </div>
  );
}
