import React, { createContext, useState, useEffect } from 'react';
import { downloadData } from '../scripts/downloadData';

export const SparseDataContext = createContext();

export const SparseDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSparseData() {
      const result = await downloadData();
      if (result.error) {
        setError(result.message);
      } else {
        setData(result);

        // Log first 10 entries of data.json
        try {
          const parsed = JSON.parse(result['data.json']);
          if (Array.isArray(parsed)) {
            console.log('First 10 items in data.json array:', parsed.slice(0, 10));
          } else if (typeof parsed === 'object' && parsed !== null) {
            const entries = Object.entries(parsed).slice(0, 10);
            console.log('First 10 key-value pairs in data.json object:', Object.fromEntries(entries));
          } else {
            console.warn('data.json is neither an array nor a plain object:', parsed);
          }
        } catch (e) {
          console.error('Failed to parse data.json:', e);
        }     

      }
      setLoading(false);
    }

    fetchSparseData();
  }, []);

  return (
    <SparseDataContext.Provider value={{ data, loading, error }}>
      {children}
    </SparseDataContext.Provider>
  );
};
