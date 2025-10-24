import React from 'react';
import './Profile.css';

const Profile = ({ username, date, messages }) => {
  return (
    <div className="profile-container">
      <h1>{username}</h1>
      <p>Дата регистрации: {date}</p>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
