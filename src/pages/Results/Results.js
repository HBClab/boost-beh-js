// src/components/Results/Results.js
import React, { useEffect, useState } from 'react';
import { useLocation }          from 'react-router-dom';
import ResultCard               from '../../components/ResultCard/ResultCard';
import Search                   from '../../components/Search/Search';
import Banner                   from '../../components/Banner/Banner';
import './Results.css';

const Results = () => {
  const location = useLocation();
  const passed   = location.state?.results;     // ← results array if we navigated here
  const [cards, setCards] = useState([]);

  // ─── helper to map raw items → card props ──────────────────────────────
  const makeCards = items =>
    items.map(item => ({
      title:    `${item.taskName} - Subject ${item.subjectId}`,
      date:     new Date(item.date).toISOString().split('T')[0],
      site:     item.session,              // for “passed” items
      category: item.category,             // now coming straight from item 
      image1:   item.png_paths[0] ?? '',
      image2:   item.png_paths[1] ?? '',
    }));
            //  

  useEffect(() => {
    // 1) if we were passed data over navigation state, use it
    if (Array.isArray(passed) && passed.length) {
      setCards(makeCards(passed));
      return;
    }

    // 2) otherwise fetch the JSON and build cards from there
    async function fetchData() {
      try {
        const res    = await fetch('data/data.json');
        const parsed = await res.json();
        const list   = [];

        // parsed is { subjectId: { site, project, tasks: { taskKey: { … } } } }
        for (const subjectId in parsed) {
          const { site, tasks } = parsed[subjectId];

          for (const taskKey in tasks) {
            const task = tasks[taskKey];
            list.push({
              title:    `${taskKey} - Subject ${subjectId}`,
              date:     new Date(task.date).toISOString().split('T')[0],
              site,                             // site comes from subject
              category: task.category,          // <- correct extraction here
              image1:   task.png_paths?.[0] ?? '',
              image2:   task.png_paths?.[1] ?? '',
            });
          }
        }

        setCards(list);
      } catch (err) {
        console.error('Failed to fetch data.json:', err);
      }
    }

    fetchData();
  }, [passed]);

  return (
    <div className="results-page">
      <Banner />
      <Search onResults={setCards} />
      <div className="results-grid">
        {cards.map((card, idx) => (
          <ResultCard key={idx} data={card} />
        ))}
      </div>
    </div>
  );
};

export default Results;
