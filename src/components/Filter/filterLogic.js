// src/components/Filter/filterLogic.js

let parsedData = null;
let flatItems = [];

/**
 * Flattens nested data.json structure
 */
function flattenData(nested) {
  return Object.entries(nested).flatMap(([subjectId, subj]) =>
    Object.entries(subj.tasks).map(([taskName, task]) => ({
      subjectId,
      taskName,
      date: task.date,
      png_paths: Array.isArray(task.png_paths) ? task.png_paths : [],
      session: subj.site ?? '',
      category: task.category ?? ''
    }))
  );
}

/**
 * Call this once before using filterData
 */
export async function initFilterData() {
  const res = await fetch('data/data.json');
  parsedData = await res.json();
  flatItems = flattenData(parsedData);
}

/**
 * Filters the pre-loaded flatItems
 * @param {{site?: string, study?: string, task?: string, category?: string}} filters
 * @returns Array of filtered task objects
 */
export function filterData(filters) {
  if (!flatItems.length) {
    console.warn('filterData called before initFilterData');
    return [];
  }

  return flatItems.filter(item => {
    const site  = item.subjectId.startsWith('9') ? 'NE' : 'UI';
    const study = item.subjectId.startsWith('7') ? 'obs' : 'int';

    if (filters.site && filters.site !== site) return false;
    if (filters.study && filters.study !== study) return false;

    if (filters.task) {
      const prefix = item.taskName.split('_')[0];
      if (prefix !== filters.task) return false;
    }

    if (filters.category && item.category !== filters.category) {
      return false;
    }

    return true;
  });
}

/**
 * Returns all flattened items (if needed for full view)
 */
export function getAllItems() {
  return flatItems;
}
