# CEREVRO Dock - Complete Feature Guide

## 🎨 Advanced Dock Features

### ✨ **NEW FEATURES**

#### 1. **Orientation Toggle** 🔄
Switch between horizontal and vertical layouts:
- Click the **Settings** icon (⚙️) in the dock
- Click **"Orientation"** to toggle between horizontal and vertical
- Your preference is automatically saved

**Horizontal Mode**: Traditional macOS-style dock at the bottom
**Vertical Mode**: Side dock (perfect for ultrawide monitors or side placement)

#### 2. **Real Website Favicons** 🌐
The dock now displays actual website icons:
- **Google**: Real Google favicon
- **Notion**: Real Notion favicon  
- **Spotify**: Real Spotify favicon
- **YouTube**: Real YouTube favicon
- Icons automatically fallback if favicon fails to load

#### 3. **Active App Tracking** 📍
Visual indicators show which apps are currently open:
- **Golden Border**: Active apps have a glowing golden border
- **Pulsing Dot**: A golden pulsing indicator appears below/beside active apps
- Easily see what's running at a glance

#### 4. **Smart Focus Timer Integration** ⏱️
When you launch an app, the dock offers to start a focus session:
- Launch any app (Google, Notion, Spotify, YouTube)
- After 2 seconds, a beautiful prompt appears
- **"Start Focus Session?"** - Click to begin a timed focus session
- Or dismiss to continue without a timer
- Perfect for ADHD users who need structured work sessions

### 🎯 **How to Use**

#### **Dragging the Dock**
1. Look for the colorful gradient handle (rainbow bar)
2. **Horizontal**: Handle is at the top of the dock
3. **Vertical**: Handle is on the left side of the dock
4. Click and drag to move anywhere on screen
5. Position is automatically saved

#### **Changing Orientation**
1. Click the Settings icon (⚙️)
2. Click "Orientation" in the settings panel
3. Dock instantly switches between horizontal ↔ vertical
4. Drag handle position updates automatically

#### **Launching Apps with Focus**
1. Click any app icon (Google, Notion, Spotify, YouTube)
2. App opens in your browser
3. Wait 2 seconds - focus prompt appears
4. Click **"Start Focus Timer"** to begin a session
5. Or click **X** to dismiss and work without a timer

#### **Managing Active Apps**
- Active apps show a golden border and pulsing dot
- Click the app again to reopen/refocus
- Dismiss the focus prompt to mark app as inactive

### 🎨 **Visual Features**

#### **Glassmorphic Design**
- Translucent background with blur effect
- Animated rainbow gradient border
- Premium macOS-inspired aesthetic

#### **Smooth Animations**
- Icons scale up on hover (macOS magnification effect)
- Nearby icons scale slightly (ripple effect)
- Smooth transitions for all interactions
- ADHD-friendly, non-jarring animations

#### **Color-Coded Icons**
Each app has its own vibrant gradient:
- 🧠 **CEREVRO**: Pink → Purple → Indigo
- 🌐 **Google**: Blue → Cyan → Teal
- 📝 **Notion**: Purple → Pink → Rose
- 🎵 **Spotify**: Green → Emerald → Teal
- 📺 **YouTube**: Red → Pink
- 🎯 **Focus**: Orange → Red → Pink
- ⚙️ **Settings**: Indigo → Purple → Pink

### 📋 **Keyboard & Mouse**

| Action | How To |
|--------|--------|
| Move Dock | Drag the rainbow handle |
| Launch App | Click app icon |
| Start Focus | Click Focus icon OR accept prompt after launching app |
| Change Orientation | Settings → Orientation |
| Dismiss Focus Prompt | Click X on the prompt |

### 🧠 **ADHD-Friendly Design**

✅ **Visual Engagement**: Colorful gradients and real favicons maintain interest
✅ **Clear Feedback**: Active indicators show what's running
✅ **Gentle Prompts**: Focus timer offers help without being intrusive
✅ **Flexible Layout**: Choose horizontal or vertical based on your workflow
✅ **Persistent Memory**: All settings saved automatically
✅ **Smooth Animations**: Non-distracting, calming transitions

### 🔧 **Technical Details**

- **Favicon Loading**: Uses direct favicon URLs with error handling
- **State Management**: React hooks for real-time updates
- **Local Storage**: Position and orientation persist between sessions
- **Active Tracking**: Set-based tracking for efficient updates
- **Z-Index Layering**: Dock (9999), Focus Prompt (10000)
- **Responsive Scaling**: 52px base → 88.4px on hover (1.7x)

### 🎉 **Pro Tips**

1. **Vertical Mode for Ultrawide**: Perfect for 21:9 or 32:9 monitors
2. **Focus Prompts**: Great for building focus habits - accept them!
3. **Active Indicators**: Quickly see what's running without switching windows
4. **Drag Anywhere**: Place dock on second monitor, corner, or anywhere you like
5. **Settings Access**: Quick toggle for orientation without leaving your workflow

Enjoy your powerful, beautiful, ADHD-friendly CEREVRO dock! 🚀
