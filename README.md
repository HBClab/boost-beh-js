# Boost Cognitive Data Application

## Table of Contents

- [Introduction ~ What does this app do?](#Introduction)
- [Installation](#Installation)
- [Usage](#Usage)

---

## Introduction

This application allows users to explore cognitive data from **Boost I/O** as it moves through the QA pipeline. It provides an interactive interface for reviewing task performance, quality categories, and search functionality.

### 🔤 Terminology & Usage Notes

- Tasks are referred to using their **standard abbreviations**  
  _Example_: `Affective Flanker` → **AF**

- QA categories are **numerical**, where **lower is better**:
  - You can search using the values: **1**, **2**, or **3**
  - _(Note: The behavior for other values is untested — try not to experiment, you'll probably be disappointed)_

---

## Installation



🛠️ Local Setup Instructions

These steps will walk you through installing Git, Docker Desktop, and running the web application locally using Docker.

---
#### Check if Git is Installed

Open a terminal (or powershell for Windows) and run:

```sh
git --version
```

If you see something like git version 2.40.1, Git is already installed. If you get an error like command not found, continue below.

---
#### 🧰 Install Git (if not already installed)

🔵 macOS

```sh 
brew install git
```

Or download it from the official installer:

👉 https://git-scm.com/download/mac

🟦 Windows

Use the below link to install Git for Windows. During installation, you can accept the default options.
https://github.com/git-for-windows/git/releases/download/v2.49.0.windows.1/Git-2.49.0-64-bit.exe

🟢 Linux (Debian/Ubuntu)
```sh
sudo apt update
sudo apt install git
```
Verify Git is working:

```sh
git --version
```


---
#### 🐳 Install Docker Desktop

🔗 Download Links:
	•	macOS/Windows: https://www.docker.com/products/docker-desktop
	•	Linux (Desktop GUI): https://docs.docker.com/desktop/install/linux-install/

🚧 During Installation:
	1.	Accept the Terms of Service
	2.	Allow any OS-level permissions or system extensions
	3.	Log in or create a Docker Hub account (free)
	4.	Once installed, open Docker Desktop and leave it running in the background

To confirm Docker is running:

```sh
docker --version
```


If Docker is not found, try restarting your terminal or logging out and back in.

⸻

#### ⬇️ Clone the Repository

In your terminal:

```sh
git clone https://github.com/HBClab/boost-beh-js.git
cd boost-beh-js
```


⸻

5. 🚀 Build and Run the App with Docker

Make sure Docker Desktop is still running.

🛠️ Build the image:
```sh
docker build -t boost-beh .
```

▶️ Run the container:

```sh
docker run -p 3000:3000 boost-beh
```

---
You can now access the app at:

🌐 http://localhost:3000

---


## Usage

The app is designed to support two main workflows:

1. **Search by Study ID**  
   Quickly locate individual participants by entering their study ID (e.g., `8001`) into the search bar.

2. **Filter by Criteria**  
   Use filters to find subsets of participants that meet specific QA or task-based conditions.

---

### 🧭 Using the Interface

- 🏠 Use the **search bar** on the **Home page** or any **Results page** to look up participants by ID.
- 🧇 Click the **waffle icon** in the top-right corner at any time to open the **filter slider** and refine your view.

