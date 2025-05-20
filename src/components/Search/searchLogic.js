// src/components/Search/searchLogic.js
import Fuse from 'fuse.js';

let parsedData = {};
let subjectFuse;
let taskFuse;
let allTasks = [];

/**
 * Load & index the JSON.
 * - parsedData holds the raw object so we can do an exact lookup.
 * - subjectFuse for fuzzy‐ID suggestions.
 * - taskFuse    for fuzzy‐task suggestions.
 */
export async function initSearch() {
  const res    = await fetch('data/data.json');
  parsedData   = await res.json();

  // 1) build subject index
  const subjectRecords = Object.keys(parsedData).map(id => ({ subjectId: id }));
  subjectFuse = new Fuse(subjectRecords, {
    keys:      ['subjectId'],
    threshold: 0.2,    // stricter for exact ID matches
  });

  // 2) flatten out all tasks for the taskFuse
  allTasks = [];
  Object.entries(parsedData).forEach(([subjectId, { tasks }]) => {
    Object.entries(tasks).forEach(([taskName, task]) => {
      allTasks.push({
        subjectId,
        taskName,
        date:      task.date,
        png_paths: task.png_paths || [],
        session:   task.session,     // from JSON
        category:  task.category,    // now using the JSON's category field
      });
    });
  });

  taskFuse = new Fuse(allTasks, {
    keys:      ['taskName'],
    threshold: 0.4,    // fuzzy on taskName
  });
}

/**
 * @param {string} query
 * @returns {Array<
 *   { type: 'subject', subjectId: string }
 *   | { type: 'task', item: { subjectId, taskName, date, png_paths, session, category } }
 * >
 */
export function search(query) {
  // 1) exact subject‐ID
  if (parsedData.hasOwnProperty(query)) {
    return [{ type: 'subject', subjectId: query }];
  }

  // 2) fuzzy subject suggestions
  const subMatches = subjectFuse.search(query).map(r => r.item.subjectId);
  if (subMatches.length) {
    return subMatches.map(id => ({ type: 'subject', subjectId: id }));
  }

  // 3) fuzzy task‐name suggestions
  return taskFuse.search(query)
    .map(r => ({ type: 'task', item: r.item }));
}

/**
 * @param {string} subjectId
 * @returns {Array<{
 *   subjectId: string,
 *   taskName: string,
 *   date: string,
 *   png_paths: string[],
 *   session: string,
 *   category: string
 * }>}
 */
export function getTasksForSubject(subjectId) {
  if (!parsedData.hasOwnProperty(subjectId)) return [];

  const { tasks } = parsedData[subjectId];
  return Object.entries(tasks).map(([taskName, task]) => ({
    subjectId,
    taskName,
    date:      task.date,
    png_paths: task.png_paths || [],
    session:   task.session,    // from JSON
    category:  task.category,   // from JSON
  }));
}
