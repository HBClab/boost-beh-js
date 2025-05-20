import React, { useState, useEffect, useRef } from 'react';
import { useNavigate }                      from 'react-router-dom';
import { initFilterData, filterData }       from './filterLogic';
import './Filter.css';

const TASK_OPTIONS  = ['AF', 'ATS', 'DSST', 'DWL', 'FN', 'LC', 'NF', 'NNB', 'NTS', 'PC', 'SM', 'VNB', 'WL'];
const SITE_OPTIONS  = ['NE', 'UI'];
const STUDY_OPTIONS = ['obs', 'int'];

export default function Filter({ onClose }) {
  const initialFilters = { site:'', study:'', task:'', category:'' };
  const [filters, setFilters] = useState(initialFilters);
  const [ready,   setReady]   = useState(false);
  const popupRef             = useRef(null);
  const navigate             = useNavigate();

  // 1) load & flatten JSON once
  useEffect(() => {
    initFilterData()
      .then(() => setReady(true))
      .catch(err => console.error('Filter init failed:', err));
  }, []);

  // 2) click-outside to close
  useEffect(() => {
    const onClickOutside = e => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [onClose]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const handleClear = () => {
    setFilters(initialFilters);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!ready) return; 
    const results = filterData(filters);
    navigate('/results', { state: { results } });
  };

  return (
    <div className="filter-popup">
      <div ref={popupRef} className="filter-content">
        <h3>Filter Tasks</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Site:
            <select name="site" value={filters.site} onChange={handleChange}>
              <option value="">All</option>
              {SITE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label>
            Study:
            <select name="study" value={filters.study} onChange={handleChange}>
              <option value="">All</option>
              {STUDY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label>
            Task:
            <select name="task" value={filters.task} onChange={handleChange}>
              <option value="">All</option>
              {TASK_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <label>
            Category:
            <input
              type="text"
              name="category"
              placeholder="e.g. 1, 2, or 3 - nothing higher!"
              value={filters.category}
              onChange={handleChange}
            />
          </label>

          <div className="filter-buttons">
            <button type="submit" disabled={!ready}>
              Apply
            </button>
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              disabled={JSON.stringify(filters) === JSON.stringify(initialFilters)}
            >
              Clear
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
