### Initialize project

npm init
npm i -D electron@latest
npm install typescript --save-dev
npm install electron-builder --save-dev
npm i electron-updater
npm install electron-log
npm i node-adodb


### Folders

- dist: destination for compiled js
- out: destination for installer
- src: typescript files
- src: original C3 files

### Links

- https://www.electron.build/
- https://www.typescriptlang.org/download
- https://www.npmjs.com/package/node-adodb
- https://davembush.medium.com/typescript-and-electron-the-right-way-141c2e15e4e1
- https://github.com/iffy/electron-updater-example

### Per Typescript

"scripts": {
    "start": "npm run compile && electron .",
    "compile": "tsc",
}

note: `tsc -w`

### For Electron Builder:

"productName": "Access C3",
"scripts": {
    "build-installer": "electron-builder"
},
"build": {
    "appId": "access-c3",
    "directories": {
        "output": "out"
    },
    "extraResources": [
        {
        "from": "./node_modules/node-adodb/lib/adodb.js",
        "to": "adodb.js"
        }
    ],
    "win": {
        "target": ["nsis"],
        "icon": "icon.ico",
        "requestedExecutionLevel": "requireAdministrator"
    },
    "nsis": {
        "installerIcon": "icon.ico",
        "uninstallerIcon": "icon.ico",
        "uninstallDisplayName": "Access C3",
        "license": "license.txt",
        "oneClick": false,
        "allowToChangeInstallationDirectory": true
    }
},