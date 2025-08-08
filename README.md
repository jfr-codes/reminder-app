# Reminder App ⏰

A simple, cross-platform desktop reminder app built using [Electron](https://www.electronjs.org/). 
It allows users to create, view, delete, and snooze reminders with a clean interface and notification-based alerts.

🧠 Features

- ✅ Add, view, and delete reminders
- ⏳ Snooze reminder notifications
- 🔔 Full-screen pop-up alerts with sound
- 💾 Reminders stored locally using JSON file
- 🖥 Built with Electron for desktop use

📸 Screenshots
---

🛠 Tech Stack

- **Electron** – Desktop app framework
- **Node.js** – Backend logic
- **HTML/CSS/JS** – UI and functionality
- **JSON** – For local storage of reminders

---

## 🚀 Getting Started (Development)

### 1. Clone the Repository

```bash
git clone https://github.com/jfr-codes/reminder-app.git
cd reminder-app

2. Install Dependencies

npm install

3. Run the App in Dev Mode

npm start


---

📦 Build App (for Production)

Windows Build

npm run make

Find the packaged .exe inside the out/make/ directory.

> To package for macOS, run the build on a Mac system. Electron Forge supports mac builds only from macOS.




---

💡 Folder Structure

reminder-app/
├── main.js                 # Main Electron process
├── preload.js             # Preload scripts
├── index.html             # UI for main window
├── manageReminder.html    # UI for reminder management
├── popup.html             # Full-screen reminder popup
├── reminders.json         # Local reminder data storage
├── assets/                # Icons and sound files
└── ...
