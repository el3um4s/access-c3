import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from "electron-updater"
import * as path from 'path';
import * as Connection from './connection';

import ADODB from 'node-adodb';

if (app.isPackaged) { ADODB.PATH = './resources/adodb.js'; }

let mainWindow: BrowserWindow;

(async () => {
		const FOUR_HOURS = 1000 * 60 * 60 * 4;
		setInterval(async () => {
			await autoUpdater.checkForUpdates();
		}, FOUR_HOURS);

		await autoUpdater.checkForUpdates();
})();

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 854,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    mainWindow.loadURL(path.join(__dirname, 'www', 'index.html'));
    mainWindow.webContents.openDevTools();
  };


app.on('ready', () => {
    console.log('App is ready', Date());
    app.name = 'Access C3';
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

ipcMain.on('list-tables', async (event, message) => {
    const positionDB = message.path;
    const connection = Connection.open(positionDB);
    const schema = await Connection.getListTables(connection);
    event.reply('list-tables', schema);
});

ipcMain.on('schema-table', async (event, message) => {
    const positionDB = message.path;
    const tableName = message.tableName;
    const connection = Connection.open(positionDB);
    const schema = await Connection.getSchemaTable(connection,tableName);
    event.reply('schema-table', schema);
});

function sendStatusToWindow(text: string) {
    console.log(text);
    mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});