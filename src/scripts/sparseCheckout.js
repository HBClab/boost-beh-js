const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra'); // npm install fs-extra
const crypto = require('crypto');

const REPO_URL = 'https://github.com/HBClab/boost-beh.git';
const BRANCH = 'main';
const SPARSE_PATHS = ['data', 'data.json'];
const TEMP_DIR = path.resolve(process.cwd(), '.temp_sparse_checkout');
const TARGET_DIR = path.resolve(process.cwd(), 'public', 'data');

function hashFileSync(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

function getAllFilesRecursive(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const res = path.resolve(dir, entry.name);
    return entry.isDirectory() ? getAllFilesRecursive(res) : res;
  });
}

function dataIsDifferent(srcDir, destDir) {
  if (!fs.existsSync(destDir)) return true;

  const srcFiles = getAllFilesRecursive(srcDir);
  for (const srcFile of srcFiles) {
    const relativePath = path.relative(srcDir, srcFile);
    const destFile = path.join(destDir, relativePath);

    if (!fs.existsSync(destFile)) return true;
    if (hashFileSync(srcFile) !== hashFileSync(destFile)) return true;
  }

  return false;
}

  async function sparseClone(logger = console.log) {
  logger('🔄 Cloning sparse repo to temp directory...');
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  execSync(`git init`, { cwd: TEMP_DIR });
  execSync(`git remote add origin ${REPO_URL}`, { cwd: TEMP_DIR });
  execSync(`git config core.sparseCheckout true`, { cwd: TEMP_DIR });

  const sparseConfig = SPARSE_PATHS.join('\n') + '\n';
  fs.writeFileSync(path.join(TEMP_DIR, '.git/info/sparse-checkout'), sparseConfig);

  execSync(`git pull origin ${BRANCH}`, { cwd: TEMP_DIR });

  const extractedDataPath = path.join(TEMP_DIR, 'data');
  const extractedJsonPath = path.join(TEMP_DIR, 'data.json');
  const targetJsonPath = path.join(TARGET_DIR, 'data.json');

  if (dataIsDifferent(extractedDataPath, TARGET_DIR) || !fs.existsSync(targetJsonPath)) {
    logger('🔁 Updating public/data with new changes...');
    fsExtra.removeSync(TARGET_DIR);
    fsExtra.copySync(extractedDataPath, TARGET_DIR);

    if (fs.existsSync(extractedJsonPath)) {
      fsExtra.copySync(extractedJsonPath, targetJsonPath);
    } else {
      logger('⚠️ data.json not found in sparse checkout');
    }
  } else {
    logger('✅ No changes found in data. Skipping update.');
  }

  fsExtra.removeSync(TEMP_DIR);
 
  logger('✅ Cleanup complete.');
}

module.exports = sparseClone;



