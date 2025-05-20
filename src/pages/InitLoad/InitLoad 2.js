// src/pages/InitLoad/InitLoad.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InitLoad() {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // subscribe to incoming log messages
    window.electronAPI.onLog(msg => {
      setLogs(prev => [...prev, msg]);
    });
    // when clone is done, jump to home
    window.electronAPI.onDone(() => {
      navigate('/');
    });
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Initializing… please wait</h1>
      <div
        style={{
          marginTop: 20,
          padding: 10,
          background: '#f0f0f0',
          height: 200,
          overflowY: 'auto',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
        }}
      >
        {logs.length === 0
          ? 'Starting up…'
          : logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
