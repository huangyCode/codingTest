import PropTypes from 'prop-types';

function ProfileDisplay({ user, onEdit }) {
  return (
    <div className="profile-display">
      <div className="profile-field">
        <strong>Name:</strong> {user.name}
      </div>
      <div className="profile-field">
        <strong>Email:</strong> {user.email}
      </div>
      <button onClick={onEdit} className="edit-button">Edit Profile</button>
    </div>
  );
}

ProfileDisplay.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ProfileDisplay;