// src/components/Banner/Waffle.js 

import React, { useState, useEffect, useRef } from 'react';
import './Filter.css';
import { filterData } from './filterLogic';

const TASK_OPTIONS  = ['AF', 'DSST', 'WL'];
const SITE_OPTIONS  = ['NE', 'UI'];
const STUDY_OPTIONS = ['obs', 'int'];

export default function Filter({ onApply, onClose }) {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    site: '', study: '', task: '', category: ''
  });
  const popupRef = useRef(null);

  useEffect(() => {
    fetch('/data/data.json')
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(setData)
      .catch(err => console.error('Failed to load data.json in filter:', err));
  }, []);

  useEffect(() => {
    const onClick = e => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!data) return;
    const result = filterData(data, filters);
    onApply(result);
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
              placeholder="e.g. 1"
              value={filters.category}
              onChange={handleChange}
            />
          </label>

          <div className="filter-buttons">
            <button type="submit">Apply</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
