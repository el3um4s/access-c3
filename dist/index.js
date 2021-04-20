"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const Connection = __importStar(require("./connection"));
const node_adodb_1 = __importDefault(require("node-adodb"));
if (electron_1.app.isPackaged) {
    node_adodb_1.default.PATH = './resources/adodb.js';
}
let mainWindow = null;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
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
electron_1.app.on('ready', () => {
    console.log('App is ready', Date());
    electron_1.app.name = 'Access C3';
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.ipcMain.on('list-tables', async (event, message) => {
    const positionDB = message.path;
    const connection = Connection.open(positionDB);
    const schema = await Connection.getListTables(connection);
    event.reply('list-tables', schema);
});
electron_1.ipcMain.on('schema-table', async (event, message) => {
    const positionDB = message.path;
    const tableName = message.tableName;
    const connection = Connection.open(positionDB);
    const schema = await Connection.getSchemaTable(connection, tableName);
    event.reply('schema-table', schema);
});
