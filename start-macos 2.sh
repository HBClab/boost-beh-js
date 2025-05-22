#!/bin/bash

# ─────────────────────────────────────────────────────────────────────────────
# 🚀 Start Script for BOOST Electron App (macOS)
# Now with:
# - Electron version locking
# - NODE_ENV checking
# - Basic error handling
# ─────────────────────────────────────────────────────────────────────────────

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}🔍  Checking for updates from upstream/main...${NC}"

#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}🔍 Checking for updates from origin...${NC}"

# ─── Git Fetch ────────────────────────────────────────────────────────────────
git fetch origin &> /dev/null

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/$(git rev-parse --abbrev-ref HEAD))

if [ "$LOCAL" != "$REMOTE" ]; then
  echo -e "${YELLOW}⬇ Updates available. Attempting to pull...${NC}"
  
  if ! git pull --rebase; then
    echo -e "${RED}⚠️  Uncommitted changes detected. Stashing changes and retrying...${NC}"
    git stash push -m "auto-stash-before-rebase" &> /dev/null

    if git pull --rebase; then
      echo -e "${GREEN}✅ Successfully pulled after stashing.${NC}"
      echo -e "${YELLOW}📦 Re-applying stashed changes...${NC}"
      git stash pop &> /dev/null
    else
      echo -e "${RED}❌ Git pull failed even after stashing. Aborting.${NC}"
      exit 1
    fi
  else
    echo -e "${GREEN}✅ Repository updated from origin.${NC}"
  fi
else
  echo -e "${GREEN}✔ Already up to date with origin.${NC}"
fi

# ─── Electron Version Lock ────────────────────────────────────────────────────
REQUIRED_ELECTRON_VERSION="28.1.0"
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
  echo -e "${YELLOW}⚠️ 
