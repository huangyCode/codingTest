import { useState, useEffect } from 'react';
import ProfileDisplay from '../components/ProfileDisplay';
import ProfileEdit from '../components/ProfileEdit';
import api from '../libs/api';
import './home.css';

function Home() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users/1'); // 假设默认用户 ID 为 1
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedUser) => {
    try {
      await api.put(`/api/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div>No user found.</div>;
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {isEditing ? (
        <ProfileEdit user={user} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <ProfileDisplay user={user} onEdit={handleEdit} />
      )}
    </div>
  );
}

export default Home;
