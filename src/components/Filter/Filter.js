// EXAMPLE USAGE OF filterLogic:
import { filterData } from './filterLogic';
import fullData from './data/data.json';

const filters = {
  site: 'NE',
  task: 'AF',
  category: '1',
};

const filtered = filterData(fullData, filters);

const [filters, setFilters] = useState({ site: "", task: "", category: "" });

useEffect(() => {
  function handleClickOutside(e) {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setShowPopup(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


import React, { useState } from 'react';

export default function Filter({ onApply, onClose }) {
  const [f, setF] = useState({
    site:     '',
    study:    '',
    task:     '',
    category: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setF(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onApply(f);
  };

  return (
    <div className="filter-popup">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Site:</label>
          <select name="site" value={f.site} onChange={handleChange}>
            <option value="">All</option>
            <option value="NE">NE</option>
            <option value="UI">UI</option>
          </select>
        </div>
        <div>
          <label>Study:</label>
          <select name="study" value={f.study} onChange={handleChange}>
            <option value="">All</option>
            <option value="obs">obs</option>
            <option value="int">int</option>
          </select>
        </div>
        <div>
          <label>Task (prefix):</label>
          <input
            type="text"
            name="task"
            placeholder="e.g. NNB"
            value={f.task}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            placeholder="e.g. 1"
            value={f.category}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Apply</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}
