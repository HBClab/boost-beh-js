#!/usr/bin/env bash
set -euxo pipefail

# --- CONFIGURATION ---
REPO_URL="https://github.com/HBClab/boost-beh.git"
BRANCH="main"
TEMP_DIR="/tmp/.temp_sparse_checkout"
TARGET_DATA_DIR="/app/public/data"
TARGET_GROUP_DIR="/app/public/group-plots"

# --- SPARSE-CHECKOUT SETUP ---
echo "🔄 Creating sparse-checkout in ${TEMP_DIR}"
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"
git init "${TEMP_DIR}"
git -C "${TEMP_DIR}" remote add origin "${REPO_URL}"
git -C "${TEMP_DIR}" config core.sparseCheckout true

# Tell Git which paths we want from the repo root:
#   • data/        → everything under data/
#   • group/plots/ → everything under group/plots/
#   • data.json    → the top-level data.json
cat > "${TEMP_DIR}/.git/info/sparse-checkout" <<EOF
data/
group/plots/
data.json
EOF

echo "🔄 Pulling ${BRANCH} (depth=1)…"
git -C "${TEMP_DIR}" pull --depth=1 origin "${BRANCH}"

# --- COPY OUT THE CHECKED-OUT FOLDERS ---

# 1) Copy data/ → /app/public/data, preserving sub-dirs
echo "🔁 Copying data/ → ${TARGET_DATA_DIR}"
rm -rf "${TARGET_DATA_DIR}"
mkdir -p "${TARGET_DATA_DIR}"
cp -a "${TEMP_DIR}/data/." "${TARGET_DATA_DIR}/"

# 2) Copy top-level data.json → into data/ so it lives at /data/data.json
echo "🔁 Copying data.json → ${TARGET_DATA_DIR}/data.json"
cp "${TEMP_DIR}/data.json" "${TARGET_DATA_DIR}/data.json"

# 3) Flatten group/plots/ → /app/public/group-plots (only files, no folders)
echo "🔁 Copying group/plots/ files → ${TARGET_GROUP_DIR}"
rm -rf "${TARGET_GROUP_DIR}"
mkdir -p "${TARGET_GROUP_DIR}"
find "${TEMP_DIR}/group/plots" -type f -exec cp "{}" "${TARGET_GROUP_DIR}/" \;

# --- CLEANUP ---
echo "✅ Cleaning up ${TEMP_DIR}"
rm -rf "${TEMP_DIR}"

# Finally, hand off to whatever CMD or ENTRYPOINT follows
exec "$@"
