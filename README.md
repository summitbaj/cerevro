# CEREVRO

CEREVRO is a productivity and focus-enhancement desktop application built for users with ADHD. It combines a smart browser launcher, sticky focus widgets, task management, and integrated white noise tools into a unified, distraction-free environment.

## ✨ Features

### 🎨 ADHD-Friendly Glassmorphic Dock
- **Beautiful macOS-style Design**: Stunning glass UI with vibrant gradient colors and smooth animations
- **Fully Draggable**: Position the dock anywhere on your screen - drag it to your preferred location and it remembers your choice
- **Orientation Toggle**: Switch between horizontal and vertical layouts with one click
- **Real Website Favicons**: Displays actual website icons for Google, Notion, Spotify, and YouTube
- **Active App Tracking**: Visual indicators (golden border + pulsing dot) show which apps are currently open
- **Smart Focus Integration**: When you launch an app, get a prompt to start a focus timer session
- **Colorful Branding**: Eye-catching, colorful brain logo designed to be visually engaging for ADHD users
- **Smooth Animations**: Gentle, non-distracting animations with hover effects and scaling
- **Quick Access**: Launch your favorite apps with beautiful gradient-themed icons
- **Persistent Settings**: Your dock position and orientation are saved between sessions

### 🎯 Focus & Productivity
- Full-screen focus overlay for distraction-free work sessions
- Integrated music player with white noise and focus music
- Task management with Zustand state management
- Smart focus timer prompts when launching apps

## Tech Stack
- **Electron**: Cross-platform desktop runtime.
- **React**: UI library.
- **Vite**: Build tool and dev server.
- **TypeScript**: Type safety.
- **Zustand**: State management.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

## Getting Started

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/summitbaj/cerevro.git
cd cerevro
npm install
```

### 2. Run Locally (Development)
Start the Electro + React development environment with hot-reload:

```bash
npm run dev
```
This will launch:
- The backend Electron main process.
- The React renderer process on `http://localhost:5173`.
- The main Dashboard window.

### 3. Build for Production
To create the installable executable for your OS (Windows .exe or macOS .dmg):

```bash
npm run build
```
The output files will be located in the `dist-app/` directory.

## Project Structure
- `electron/`: Main process code (OS interactions, window management).
- `src/`: React renderer code (UI components, styles).
- `dist-app/`: Packaged application output.
