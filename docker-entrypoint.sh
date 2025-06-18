#!/bin/bash
set -eux

REPO_URL="https://github.com/HBClab/boost-beh.git"
BRANCH="main"
TEMP_DIR="/tmp/.temp_sparse_checkout"
TARGET_DIR="/app/public/data"

echo "🔄 Creating sparse-checkout in ${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"
git init "${TEMP_DIR}"
git -C "${TEMP_DIR}" remote add origin "${REPO_URL}"
git -C "${TEMP_DIR}" config core.sparseCheckout true
mkdir -p "${TEMP_DIR}/.git/info"
echo -e "data/\ndata.json" > "${TEMP_DIR}/.git/info/sparse-checkout"
git -C "${TEMP_DIR}" pull origin "${BRANCH}" --depth=1

echo "🔁 Copying sparse-checked data to ${TARGET_DIR}"
rm -rf "${TARGET_DIR}"
mkdir -p "${TARGET_DIR}"
cp -R "${TEMP_DIR}/data/." "${TARGET_DIR}/"
if [ -f "${TEMP_DIR}/data.json" ]; then
  cp "${TEMP_DIR}/data.json" "${TARGET_DIR}/data.json"
fi

echo "✅ Cleaning up"
rm -rf "${TEMP_DIR}"

# Start the app
exec "$@"
