const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
const { checkOnDependencies, getLocalLotusVersion, getCurrentLotusVersion } = require('./cli');
const isOnline = require('is-online');
const { remote } = require('electron/renderer');
 
let mainWindow;
 
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        show: false,
        webPreferences: { webSecurity: false, nodeIntegration: true, preload: __dirname + '/preload.js' }
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
 
    mainWindow.loadURL(startURL);
 
    mainWindow.once('ready-to-show', async () => { 
        mainWindow.show();
        const online = await isOnline();        
        let lotusVersion;
        let updateAvailable = false;
        const missingDependencies = await checkOnDependencies();
        try {
            lotusVersion = await getLocalLotusVersion();   
        } catch (error) {
            console.log("No lotus installed");
        }        

        if(online && lotusVersion) {
            const remoteLotusVersions = await getCurrentLotusVersion()
            const thisIndex = remoteLotusVersions.indexOf(lotusVersion);
            if(thisIndex !== 0) {
                //  We need to upgrade Lotus
                updateAvailable = true;
            }
        }

        let electronState = {
            lotusVersion, 
            missingDependencies, 
            updateAvailable
        }

        mainWindow.webContents.send('electron-state', JSON.stringify(electronState))
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.on('ready', createWindow);