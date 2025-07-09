// src/components/Search/Search.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initSearch, search, getTasksForSubject } from './searchLogic';
import icon from '../../assets/svg/search.svg';
import './Search.css';

const Search = ({ className = ''}) => {
  const [query, setQuery]             = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => { initSearch() }, []);

  const goToResults = (results) => {
    navigate('/results', { state: { results } });
  };

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    setActiveIndex(-1);

    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    setSuggestions(search(q));  // remove slice(0, 5) to fix max issues
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        selectSuggestion(suggestions[activeIndex]);
      } else if (query.trim()) {
        // no highlight → treat entire query
        const subs = suggestions.filter(s => s.type === 'subject');
        if (subs.length) {
          goToResults(getTasksForSubject(subs[0].subjectId));
        } else {
          goToResults(search(query)
            .filter(s => s.type === 'task')
            .map(s => s.item));
        }
        reset();
      }
    }
  };

  const selectSuggestion = (s) => {
    if (s.type === 'subject') {
      goToResults(getTasksForSubject(s.subjectId));
    } else {
      goToResults([s.item]);
    }
    reset();
  };

  const reset = () => {
    setQuery('');
    setSuggestions([]);
    setActiveIndex(-1);
  };

  return (
    <div className={"search-container ${className}"}>
      <input
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search…"
        className="search-input"
      />
      <button
        className="search-button"
        onClick={() => selectSuggestion(suggestions[0] || { type: 'task', item: null })}
      >
      <img src={icon} alt="search button" className="search-icon" />
      </button>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((s, idx) => (
            <li
              key={s.type + (s.subjectId||s.item.subjectId) + idx}
              className={idx === activeIndex ? 'active' : ''}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => selectSuggestion(s)}
            >
              {s.type === 'subject'
                ? `Subject ${s.subjectId}`
                : `${s.item.subjectId} – Task: ${s.item.taskName}`}
            </li>
          ))}
          <li className="suggestions-footer">
            {suggestions.length} result{suggestions.length !== 1 && 's'}
          </li>
        </ul>
      )}
    </div>
  );
};

export default Search;
