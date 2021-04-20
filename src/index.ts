import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from "electron-updater"
import * as path from 'path';
import * as Connection from './connection';

import ADODB from 'node-adodb';

if (app.isPackaged) { ADODB.PATH = './resources/adodb.js'; }

let mainWindow = null;

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
    autoUpdater.checkForUpdatesAndNotify();
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
