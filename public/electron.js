const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const yauzl = require('yauzl');
const XLSX = require('xlsx');
const JSZip = require('jszip'); // Используем jszip вместо adm-zip

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
    });

    mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('select-file', async () => {
    const { filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Supported Files', extensions: ['zip', 'xls', 'xlsx'] }]
    });

    return filePaths.length > 0 ? filePaths[0] : null;
});


ipcMain.handle('extract-zip', async (event, filePath) => {
    try {
        const data = await fs.promises.readFile(filePath);
        const zip = await JSZip.loadAsync(data);
        const files ="";

        zip.forEach((relativePath, zipEntry) => {
            files.push(zipEntry.name);
        });

        return files;

    } catch (error) {
        console.error("Error extracting files:", error);
        throw error;
    }
});

ipcMain.handle('parse-excel', async (event, filePath) => {
    try {
        if (!filePath) {
            throw new Error("File path is undefined"); // Explicit error if filePath is missing
        }
        const buffer = fs.readFileSync(filePath);
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        return workbook.SheetNames.map(sheet => XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
    } catch (error) {
        console.error("Error reading excel file", error);
        throw error;
    }

});

ipcMain.handle('save-zip', async (event, { filePath, htmlContent, existingZip }) => {
    try {
        if (existingZip) {
            const data = fs.readFileSync(existingZip);
            const zip = await JSZip.loadAsync(data);

            if (zip.file('index.php')) {
                let indexContent = await zip.file('index.php').async('string');
                indexContent = indexContent.replace(/<div id="my-content">[\s\S]*?<\/div>/i, `<div id="my-content">${htmlContent}</div>`);
                zip.file('index.php', indexContent);
            } else {
                throw new Error('index.php not found');
            }

            const newZipData = await zip.generateAsync({ type: 'nodebuffer' });
            fs.writeFileSync(filePath, newZipData);
        } else {
            const zip = new JSZip();
            zip.file('output.html', htmlContent);
            const newZipData = await zip.generateAsync({ type: 'nodebuffer' });
            fs.writeFileSync(filePath, newZipData);
        }
    } catch (error) {
        console.error('Error modifying ZIP:', error);
        throw error;
    }
});

ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
});

ipcMain.handle('read-file', async (event, filePath) => {
    try {
        return fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error('Error reading file', error);
        throw error;
    }

});

ipcMain.handle('write-file', async (event, { filePath, content }) => {
    try {
        return fs.promises.writeFile(filePath, content);
    } catch (error) {
        console.error("Error writing file", error)
        throw error;
    }
});