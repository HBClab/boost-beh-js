/**
 * Handles downloading the CSV file
 * @param {Object} result - The search result object
 */
export const downloadCsv = (csvPath) => {
  if (!csvPath) {
    console.error('CSV path is not provided');
    return;
  } 
  console.log('Downloading CSV from:', csvPath);
  fetch(csvPath)
    .then(response => {
      if (!response.ok) throw new Error('CSV file not found');
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = csvPath.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => console.error('Error downloading CSV:', error));
};
