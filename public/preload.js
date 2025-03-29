const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    selectFile: () => ipcRenderer.invoke('select-file'),
    extractZip: (filePath) => ipcRenderer.invoke('extract-zip', filePath),
    parseExcel: (filePath) => ipcRenderer.invoke('parse-excel', filePath),
    saveZip: (data) => ipcRenderer.invoke('save-zip', data),
    showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    writeFile: (data) => ipcRenderer.invoke('write-file', data),
});