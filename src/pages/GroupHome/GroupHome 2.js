// src/pages/GroupHome/GroupHome.js
import React from "react";
import { useNavigate } from "react-router-dom";

import Banner from "../../components/Banner/Banner";
import "./GroupHome.css";

const GroupHome = () => {
  const navigate = useNavigate();

  return (
    <div className="grouphome-container">
      {/* top banner */}
      <Banner />
      <div className="title-container">
        <div className="page-title">Group Plots</div>
        <div className="title-divider"></div>
        <div className="page-subtitle">
          Click on a task group to see its group plots.
        </div>
      </div>


      {/* 2×2 grid of buttons */}
      <div className="button-grid">
        <div className="button-wrapper">
          <button onClick={() => navigate("/group/task-switching")}>
            Task Switching
          </button>
        </div>
        <div className="button-wrapper">
          <button onClick={() => navigate("/group/flanker")}>
            Flanker
          </button>
        </div>
        <div className="button-wrapper">
          <button onClick={() => navigate("/group/n-back")}>
            N-Back
          </button>
        </div>
        <div className="button-wrapper">
          <button onClick={() => navigate("/group/processing-speed-memory")}>
            Processing Speed & Memory
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupHome;
