#!/bin/bash

# ─────────────────────────────────────────────────────────────────────────────
# 🚀 Start Script for BOOST Electron App (macOS)
# ─────────────────────────────────────────────────────────────────────────────

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}🔍  Checking for updates from upstream/main...${NC}"

# ─── Git Update Check ─────────────────────────────────────────────────────────
git fetch || {
  echo -e "${RED}❌ Failed to fetch from remote. Check your network or repo URL.${NC}"
  exit 1
}

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse FETCH_HEAD)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo -e "${YELLOW}⬇ Updates found. Attempting to pull changes...${NC}"

  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected. Stashing before pull...${NC}"
    git stash push -m "auto-stash-before-pull" &> /dev/null
    STASHED=true
  fi

  git pull --rebase || {
    echo -e "${RED}❌ Git pull failed. Aborting.${NC}"
    exit 1
  }

  echo -e "${GREEN}✅ Repository updated.${NC}"

  if [ "$STASHED" = true ]; then
    echo -e "${YELLOW}📦 Re-applying stashed changes...${NC}"
    git stash pop &> /dev/null
  fi
else
  echo -e "${GREEN}✔ Already up to date with FETCH_HEAD.${NC}"
fi

# ─── Compare with upstream/main ───────────────────────────────────────────────
git fetch main &> /dev/null
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse main)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo -e "${YELLOW}⬇ Updates available from upstream/main. Pulling...${NC}"
  git pull main --rebase || {
    echo -e "${RED}❌ Git pull from upstream failed. Aborting.${NC}"
    exit 1
  }
  echo -e "${GREEN}✅ Repository updated from upstream.${NC}"
else
  echo -e "${GREEN}✔ Already up to date with upstream/main.${NC}"
fi

# ─── Electron Version Lock ────────────────────────────────────────────────────
REQUIRED_ELECTRON_VERSION="36.2.1"
INSTALLED_ELECTRON_VERSION=$(npx --yes electron --version 2>/dev/null | sed 's/^v//')

if [ "$INSTALLED_ELECTRON_VERSION" != "$REQUIRED_ELECTRON_VERSION" ]; then
  echo -e "${RED}❌ Electron version mismatch!${NC}"
  echo -e "${YELLOW}🔒 Required: $REQUIRED_ELECTRON_VERSION | Found: $INSTALLED_ELECTRON_VERSION${NC}"
  echo -e "${YELLOW}👉 Please run: npm install electron@$REQUIRED_ELECTRON_VERSION${NC}"
  exit 1
else
  echo -e "${GREEN}✔ Electron version locked to $REQUIRED_ELECTRON_VERSION${NC}"
fi

# ─── NODE_ENV Check ───────────────────────────────────────────────────────────
if [ -z "$NODE_ENV" ]; then
  echo -e "${YELLOW}⚠️  NODE_ENV is not set. Defaulting to 'production'.${NC}"
  export NODE_ENV=production
else
  echo -e "${GREEN}✔ NODE_ENV is set to '$NODE_ENV'${NC}"
fi

# ─── Start App ────────────────────────────────────────────────────────────────
echo -e "\n${YELLOW}🚀 Launching the BOOST Electron app...${NC}"

# Try-like: Check if build exists, else attempt to build
if [ ! -f "./build/index.html" ]; then
  echo -e "${YELLOW}⚙️  Build not found. Attempting to run 'npm run build'...${NC}"
  npm run build || {
    echo -e "${RED}❌ Failed to build the React app. Aborting.${NC}"
    exit 1
  }
fi

# Start Electron app
npx --yes electron . --no-sandbox || {
  echo -e "${RED}❌ Electron failed to start.${NC}"
  exit 1
}
