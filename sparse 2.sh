set -euo pipefail

# --- CONFIGURATION ---
REPO_URL="https://github.com/HBClab/boost-beh.git"
BRANCH="main"
TEMP_DIR="/tmp/.temp_sparse_checkout"
TARGET_DATA_DIR="public/data"
TARGET_GROUP_DIR="public/group-plots"

# --- SPARSE CHECKOUT SETUP ---
echo "🔄 Creating sparse‐checkout in ${TEMP_DIR}"
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"
git init "${TEMP_DIR}"
git -C "${TEMP_DIR}" remote add origin "${REPO_URL}"
git -C "${TEMP_DIR}" config core.sparseCheckout true

# Tell Git which paths we want:
#  • data/           → all of data
#  • group/plots/    → just the plots subfolder
cat > "${TEMP_DIR}/.git/info/sparse-checkout" <<EOF
data/
group/plots/
data.json 
EOF

# Fetch only that subset
echo "🔄 Pulling ${BRANCH} (depth=1)"
git -C "${TEMP_DIR}" pull --depth=1 origin "${BRANCH}"

# --- COPY OUT THE CHECKED‐OUT FOLDERS ---

# 1) Copy data → /app/public/data
echo "🔁 Copying data/ → ${TARGET_DATA_DIR}"
rm -rf "${TARGET_DATA_DIR}"
mkdir -p "${TARGET_DATA_DIR}"
cp -R "${TEMP_DIR}/data/." "${TARGET_DATA_DIR}/"
cp "${TEMP_DIR}/data.json" "${TARGET_DATA_DIR}/"

# 2) Copy plots into a flat 'group' folder → /app/public/group
echo "🔁 Copying group/plots/ → ${TARGET_GROUP_DIR}"
rm -rf "${TARGET_GROUP_DIR}"
mkdir -p "${TARGET_GROUP_DIR}"
cp -R "${TEMP_DIR}/group/plots/." "${TARGET_GROUP_DIR}/"

# --- CLEANUP ---
echo "✅ Cleaning up ${TEMP_DIR}"
rm -rf "${TEMP_DIR}"

