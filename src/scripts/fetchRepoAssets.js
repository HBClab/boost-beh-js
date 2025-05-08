import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

const owner = 'HBClab';
const repo = 'boost-beh';
const branch = 'main';
const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
const publicPath = path.join(process.cwd(), 'public'); // Adjust if needed

const pathsToFetch = ['data', 'data.json'];

async function ensureDirExists(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeFileToPublic(subPath, content) {
  const fullPath = path.join(publicPath, subPath);
  await ensureDirExists(path.dirname(fullPath));
  await fs.writeFile(fullPath, content, 'utf-8');
}

async function downloadFile(fileMeta) {
  const res = await fetch(fileMeta.download_url);
  if (!res.ok) throw new Error(`Failed to download ${fileMeta.path}`);
  return await res.buffer(); // Use buffer for images or binary-safe text
}

async function downloadAndWrite(pathToFetch) {
  const url = `${baseUrl}/${pathToFetch}?ref=${branch}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub fetch failed for ${pathToFetch}: ${res.statusText}`);
  const data = await res.json();

  if (Array.isArray(data)) {
    // Directory
    for (const item of data) {
      if (item.type === 'file') {
        const content = await downloadFile(item);
        await writeFileToPublic(item.path, content);
        console.log(`✅ Copied: ${item.path}`);
      } else if (item.type === 'dir') {
        // Recursively handle subdirectories
        await downloadAndWrite(item.path);
      }
    }
  } else {
    // Single file
    const content = await downloadFile(data);
    await writeFileToPublic(data.path, content);
    console.log(`✅ Copied: ${data.path}`);
  }
}

async function main() {
  console.log('🔄 Starting data fetch...');
  try {
    for (const path of pathsToFetch) {
      await downloadAndWrite(path);
    }
    console.log('🎉 All files downloaded and saved to /public/');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
