export async function downloadData() {
  const owner = 'HBClab'; // replace with actual GitHub username or org
  const repo = 'boost-beh';   // replace with actual repo name
  const branch = 'main';      // adjust if needed
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
  const paths = ['data', 'data.json'];

  const results = {};

  try {
    for (const path of paths) {
      const url = `${baseUrl}/${path}?ref=${branch}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
      }

      const data = await response.json();

      // If it's a directory, download each file recursively
      if (Array.isArray(data)) {
        results[path] = {};
        for (const file of data) {
          if (file.type === 'file') {
            const fileRes = await fetch(file.download_url);
            if (!fileRes.ok) {
              throw new Error(`Failed to fetch ${file.path}: ${fileRes.statusText}`);
            }
            const content = await fileRes.text();
            results[path][file.name] = content;
          }
        }
      } else {
        // It's a single file
        const fileRes = await fetch(data.download_url);
        if (!fileRes.ok) {
          throw new Error(`Failed to fetch ${path}: ${fileRes.statusText}`);
        }
        const content = await fileRes.text();
        results[path] = content;
      }
    }

    return results;
  } catch (error) {
    console.error('Sparse checkout failed:', error.message);
    return { error: true, message: error.message };
  }
}
