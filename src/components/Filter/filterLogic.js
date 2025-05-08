// filterLogic.js

export function filterData(data, filters) {
  return Object.entries(data).reduce((acc, [subjectId, subjectData]) => {
    // Determine computed values
    const site = subjectId.startsWith('9') ? 'NE' : 'UI';
    const study = subjectId.startsWith('7') ? 'obs' : 'int';

    // Check site and study filters
    if (filters.site && filters.site !== site) return acc;
    if (filters.study && filters.study !== study) return acc;

    // Filter tasks
    const filteredTasks = Object.entries(subjectData.tasks).filter(
      ([taskKey, taskVal]) => {
        // Task prefix filtering
        if (filters.task) {
          const taskPrefix = taskKey.split('_')[0];
          if (taskPrefix !== filters.task) return false;
        }

        // Category filtering
        if (filters.category && taskVal.category !== filters.category) {
          return false;
        }

        return true;
      }
    );

    if (filteredTasks.length > 0) {
      acc[subjectId] = {
        ...subjectData,
        site,
        project: study,
        tasks: Object.fromEntries(filteredTasks),
      };
    }

    return acc;
  }, {});
}
