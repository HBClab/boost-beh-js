// src/components/Banner/Waffle.js 


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter from './Filter';
import { filterData } from './filterLogic';
import fullData from './data/data.json';

export default function Waffle() {
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const openFilter = () => setShowFilter(true);
  const closeFilter = () => setShowFilter(false);

  const applyFilters = (filters) => {
    // 1) Filter your raw data
    const filtered = filterData(fullData, filters);

    // 2) Turn that into the shape your Results page expects
    const cards = Object.entries(filtered).flatMap(
      ([subjectId, subjectData]) =>
        Object.entries(subjectData.tasks).map(([taskKey, taskVal]) => ({
          title:    `${taskKey} - Subject ${subjectId}`,
          date:     new Date(taskVal.date).toISOString().split('T')[0],
          site:     subjectData.site,
          category: taskVal.category,
          image1:   taskVal.png_paths?.[0] ?? '',
          image2:   taskVal.png_paths?.[1] ?? ''
        }))
    );

    // 3) Close the filter UI
    setShowFilter(false);

    // 4) Navigate to Results, passing cards via location.state
    navigate('/results', { state: { results: cards } });
  };

  return (
    <div className="waffle-container">
      <button onClick={openFilter}>
        ☰ Filter Tasks
      </button>

      {showFilter && (
        <Filter
          onApply={applyFilters}
          onClose={closeFilter}
        />
      )}
    </div>
  );
}
