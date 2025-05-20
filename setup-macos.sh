#!/bin/bash

# ─────────────────────────────────────────────────────────────────────────────
# 🛠️  macOS Setup Script for BOOST Electron App
#
# Designed for internal use with minimal output but useful status messages.
# ─────────────────────────────────────────────────────────────────────────────

# Make output more readable
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${YELLOW}🔧 Starting setup for BOOST app on macOS...${NC}"
echo ""

# ─── Check for Git ───────────────────────────────────────────────────────────
if ! command -v git &> /dev/null; then
  echo -e "${RED}❌ Git is not installed.${NC}"
  echo -e "${YELLOW}📦 Installing Git via Homebrew...${NC}"
  
  if ! command -v brew &> /dev/null; then
    echo -e "${RED}❌ Homebrew not found. Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo -e "${GREEN}✅ Homebrew installed.${NC}"
  fi

  brew install git &> /dev/null
  echo -e "${GREEN}✅ Git installed.${NC}"
else
  echo -e "${GREEN}✔ Git is already installed.${NC}"
fi

# ─── Check for Node and NPM ──────────────────────────────────────────────────
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ Node.js or npm is not installed.${NC}"
  echo -e "${YELLOW}📦 Installing Node.js via Homebrew...${NC}"
  brew install node &> /dev/null
  echo -e "${GREEN}✅ Node.js and npm installed.${NC}"
else
  echo -e "${GREEN}✔ Node.js and npm are already installed.${NC}"
fi

# ─────────────────────────────────────────────────────────────────────────────

echo -e "\n${YELLOW}📁 Preparing project dependencies...${NC}"

# ─── Check for Node and NPM ──────────────────────────────────────────────────
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ Node.js or npm is not installed.${NC}"
  echo -e "${YELLOW}📦 Installing Node.js via Homebrew...${NC}"

  if brew install node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js installed.${NC}"

    # Add Node to PATH manually if still not found
    if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
      echo -e "${YELLOW}⚙️  Node still not available. Trying to source shell profile...${NC}"

      SHELL_PROFILE=""
      [[ -f ~/.zshrc ]] && SHELL_PROFILE=~/.zshrc
      [[ -f ~/.bash_profile ]] && SHELL_PROFILE=~/.bash_profile
      [[ -f ~/.bashrc ]] && SHELL_PROFILE=~/.bashrc

      if [ -n "$SHELL_PROFILE" ]; then
        source "$SHELL_PROFILE"
        export PATH="/opt/homebrew/bin:$PATH" # For Apple Silicon
      fi

      # Recheck availability
      if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ Node.js installation complete but not available in PATH.${NC}"
        echo -e "${YELLOW}👉 Try opening a new terminal session or add Homebrew to PATH manually.${NC}"
        exit 1
      fi
    fi
  else
    echo -e "${RED}❌ Failed to install Node.js via Homebrew.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}✔ Node.js and npm are already installed.${NC}"
fi

# ─── Verify React ─────────────────────────────────────────────────────────────
if [ -d "node_modules/react" ]; then
  echo -e "${GREEN}✔ React is present in node_modules.${NC}"
else
  echo -e "${RED}❌ React not found. Please ensure your package.json is correct.${NC}"
  exit 1
fi

# ─── Verify Electron ──────────────────────────────────────────────────────────
if [ -d "node_modules/electron" ]; then
  echo -e "${GREEN}✔ Electron is present in node_modules.${NC}"
else
  echo -e "${RED}❌ Electron not found. Please check that it is listed in package.json.${NC}"
  exit 1
fi

# ─────────────────────────────────────────────────────────────────────────────
echo -e "\n${GREEN}🚀  Setup complete. You can now start the app with your run script.${NC}"
