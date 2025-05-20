import React from 'react';
import Banner from "../../components/Banner/Banner";
import './InProgress.css';

function InProgress() {
  return (
    <div className="home-container">
      <Banner />
      <div className="home-content">
        <div className="inprogress-title">🚧 This Page is In Progress 🚧</div>
        <p className="inprogress-subtitle">Zak is building group level plots that will be available soon!</p>
      </div>
    </div>
  );
}

export default InProgress;
