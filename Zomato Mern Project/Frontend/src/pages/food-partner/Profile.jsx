import React, { useState, useEffect } from 'react';
import '../../styles/profile.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/food-partner/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setProfile(res.data.foodPartner);
        setVideos(res.data.foodPartner.foodItems);
      });
  }, [id]);

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-meta">
          <img className="profile-avatar" src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37" alt="" />

          <div className="profile-info">
            <h1 className="profile-pill profile-business">{profile?.name}</h1>
            <p className="profile-pill profile-address">{profile?.address}</p>
          </div>
        </div>

        {/* 🔥 ADD FOOD BUTTON */}
        <button
          className="btn-primary"
          onClick={() => navigate('/create-food')}
          style={{ marginTop: '16px' }}
        >
          Add Food
        </button>
      </section>

      <hr className="profile-sep" />

      <section className="profile-grid">
        {videos.length === 0 && <p>No videos yet</p>}

        {videos.map((v) => (
          <div key={v._id} className="profile-grid-item">
            <video
              className="profile-grid-video"
              src={v.video}
              muted
              playsInline
              preload="metadata"
            />
          </div>
        ))}
      </section>
    </main>
  );
};

export default Profile;
