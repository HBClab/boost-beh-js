// src/components/Results/Results.js
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation }                               from 'react-router-dom';
import ResultCard                                    from '../../components/ResultCard/ResultCard';
import Search                                        from '../../components/Search/Search';
import Banner                                        from '../../components/Banner/Banner';
import Filter                                        from '../../components/Filter/Filter';
import './Results.css';

export default function Results() {
  const { state }       = useLocation();
  const passedResults = useMemo(
    () => state?.results ?? [],
    [state?.results]
  );
  const [cards, setCards] = useState([]);

  const toCard = useCallback(item => {
    // decide project folder
    const project = String(item.subjectId).startsWith('7') ? 'obs' : 'int';
    const site = String(item.subjectId).startsWith('9') ? 'NE' : 'UI';

    // normalize site and category
    const category = item.category ?? '';
    // split task name by first '_' where preceeding part is task name
    const task = item.taskName.split('_')[0] ?? '';

    // build csv path relative to /public
    const csv = `/data/${project}/${site}/${item.subjectId}/${task}/data/${item.subjectId}_ses-${item.session}_cat-${category}.csv`;
    return {
      title:    `Subject ${item.subjectId} - ${task}`,
      date:     new Date(item.date).toISOString().split('T')[0],
      site: item.session,
      category,
      image1:   item.png_paths?.[0] ?? '',
      image2:   item.png_paths?.[1] ?? '',
      csv       // <-- newly added
    };
  }, []);
  //  This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
  // whenever `passedResults` changes, re-map to cards
  useEffect(() => {
    setCards(passedResults.map(toCard));
  }, [passedResults, toCard]);

  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="results-container">
      <Banner>
        {/* you can move this Filter button into Banner if you like */}
        <button onClick={() => setShowFilter(true)}>Filter</button>
      </Banner>

      <Search className="search-wrapper"/>

      {showFilter && (
        <Filter onClose={() => setShowFilter(false)} />
      )}

      <div className="results-grid">
        {cards.map((c,i) => 
          <div className="card-wrapper" key={i}>
            <ResultCard key={i} data={c}/>
          </div>
        )}
      </div>
    </div>
  );
}
