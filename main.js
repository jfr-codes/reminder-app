const { app, BrowserWindow, Tray, Menu, ipcMain  } = require('electron');
const path = require('path');
const fs = require('fs');

let tray = null;
let win, manageWin;
const remindersFile = path.join(__dirname, 'reminders.json');

function manageReminderFunction(){
    manageWin = new BrowserWindow({
        width: 700,
        height: 600,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    manageWin.loadFile('manageReminder.html');
}

ipcMain.handle('addReminder', async (event, task, datetime) => {
    
    const id = Date.now();
     
    const newReminder = { task, datetime, id };
    let data = [];

    try {
        try {
            const existing = fs.readFileSync(remindersFile, 'utf-8');
            data = JSON.parse(existing || '[]');
        } catch ( readErr) {
            if (readErr.code !== 'ENOENT') throw readErr;
        }
         
        data.push(newReminder);
        fs.writeFileSync(remindersFile, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error in addReminder ', err);
    }
    


});

ipcMain.handle('getReminder', () => {
    const reminders = path.join(__dirname, 'reminders.json');
    if (!fs.existsSync(reminders)) return [];

    const content = fs.readFileSync(reminders, 'utf-8');
    return JSON.parse(content || '[]');

});

ipcMain.handle('deleteReminder', (event, id) => {
     
    const reminders = path.join(__dirname, 'reminders.json');
    let fetchedReminders = null;
    if (fs.existsSync(reminders)){
        fetchedReminders = fs.readFileSync(reminders, 'utf-8');
    }
    let data = JSON.parse(fetchedReminders || '[]');

    const filteredData = data.filter(item => item.id !== id);
    fs.writeFileSync(remindersFile, JSON.stringify(filteredData, null, 2));
    return filteredData;
    
});

ipcMain.handle('snoozeReminder', (event, task, datetime) => {
        const newReminder = { task, datetime};
        let data = [];
        if (fs.existsSync(remindersFile)) {
            const existing = fs.readFileSync(remindersFile, 'utf-8');
            data = JSON.parse(existing || '[]');
        }
        data.push(newReminder);
        fs.writeFileSync(remindersFile, JSON.stringify(data, null, 2));

        return true;
});

function createTray() {
    tray = new Tray(path.join(__dirname, 'appIcon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Manage Reminders',
            click: () => {
                manageReminderFunction();
                manageWin.loadFile('manageReminder.html');
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);
    tray.setToolTip('Reminder App');
    tray.setContextMenu(contextMenu);
}



 function checkRemindersPeriodically() {
    const remindersFile = path.join(__dirname, 'reminders.json'); 

    setInterval(() => {
        if (!fs.existsSync(remindersFile)) return;

        const content = fs.readFileSync(remindersFile, 'utf-8');
        let reminders = JSON.parse(content || '[]');
        const now = new Date();

        const dueReminders = reminders.filter(r => {
            const scheduledTime = new Date(r.datetime);
            return scheduledTime <= now;
        });

        if (dueReminders.length > 0) {
            const upcomingReminders = reminders.filter(r => {
                const scheduledTime = new Date(r.datetime);
                return scheduledTime > now;
            });

            fs.writeFileSync(remindersFile, JSON.stringify(upcomingReminders, null, 2));

            const taskToShow = dueReminders;
            let tasksToPass = "";
            taskToShow.forEach(element => {
                tasksToPass = tasksToPass + element.task + "<br>";
            });

            console.log(tasksToPass);
            showReminderPopup(tasksToPass);
        }
    }, 0.50000);
 }

function showReminderPopup(taskText) {
    const popup = new BrowserWindow({
        fullscreen: true,
        transparent: true,
        frame: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        }
        
    });

    popup.loadFile('index.html', {
        query: {task: taskText }
    });

    popup.once('ready-to-show', () => {
        popup.show();
    });

    popup.on('blur', () => {
        popup.close();
    });

}

app.whenReady().then( () => {
    createTray();
    //manageReminderFunction();
    checkRemindersPeriodically();
    
});

app.on('window-all-closed', () => {
     //
});