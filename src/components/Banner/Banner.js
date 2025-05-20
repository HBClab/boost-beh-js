// src/components/Banner/Banner.js
import React, { useState, useEffect } from "react";
import './Banner.css';
import { useNavigate } from "react-router-dom";
import { ReactComponent as IconSvg } from "../../assets/svg/icon.svg";
import waffle from "../../assets/svg/waffle.svg";
import Filter from "../Filter/Filter";          // adjust path as needed
import { filterData } from "../Filter/filterLogic";    // adjust path as needed

const fs = window.require?.('fs');
const path = window.require?.('path');
const Banner = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [rawData, setRawData]     = useState(null);
  const navigate                  = useNavigate();

  // 1) Fetch data.json once on mount
useEffect(() => {
  try {
    const jsonData = fetch('data/data.json');
    setRawData(jsonData);
  } catch (err) {
    console.error('❌ Failed to load data.json in banner (via preload):', err);
  }
}, []);

  const openFilter  = () => setShowFilter(true);
  const closeFilter = () => setShowFilter(false);

  const applyFilters = (filters) => {
    if (!rawData) {
      console.warn('Data not loaded yet');
      return;
    }

  // ✅ Banner just passes the raw acc object
  const filteredAcc = filterData(rawData, filters);
  navigate('/results', { state: { filtered: filteredAcc } });
  };
  const testingHome = () => {
    console.log('navigating home');
    navigate('/');
  };


  return (
    <div className="navigation">
      <div className="navigationBackground" />

      {/* Top-left icon */}
      <button className="topLeftIcon" onClick={testingHome}>
        <IconSvg alt="BOOST icon" className="topLeftIcon-img" />
      </button>

      {/* Waffle filter button */}
      <div className="buttonWrapper">
        <button className="circleButton" onClick={openFilter}>
          <img src={waffle} alt="Filter" className="waffleIcon" />
        </button>
      </div>

      {/* Main nav links */}
      <div className="navButtons">
        <button className="navButton" onClick={() => navigate('/')}>
          Home
        </button>
        <button className="navButton" onClick={() => navigate('/inprogress')}>
          Group Level Analyses
        </button>
      </div>

      {/* Filter popup */}
      {showFilter && (
        <Filter
          onApply={applyFilters}
          onClose={closeFilter}
        />
      )}
    </div>
  );
};

export default Banner;
