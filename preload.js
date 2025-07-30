const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('reminderAPI', {
    getReminder: () => ipcRenderer.invoke('getReminder'),
    addReminder: (task, datetime) => ipcRenderer.invoke('addReminder', task, datetime),
    deleteReminder: (id) => ipcRenderer.invoke('deleteReminder', id),
    snoozeReminder: (task, datetime) => ipcRenderer.invoke('snoozeReminder', task, datetime)
    
});