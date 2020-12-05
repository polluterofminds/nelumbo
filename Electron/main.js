const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const {
  checkOnDependencies,
  getLocalLotusVersion,
  getCurrentLotusVersion,
  installDependencies,
  startWorkers,
  startMiner, 
  checkLotusState
} = require("./cli");
const isOnline = require("is-online");

let mainWindow;
let electronState;

try {
  require("electron-reloader")(module);
} catch (_) {}

const startLotus = async () => {
  try {
    mainWindow.webContents.send("launch-updates", "Starting workers...");
    await startWorkers();
    mainWindow.webContents.send("launch-updates", "Starting miner...");
    await startMiner();
    mainWindow.webContents.send("launch-updates", "Done");
  } catch (error) {
    throw error;
  }
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      preload: __dirname + "/preload.js",
    },
  });
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", async () => {
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

    if (online && lotusVersion) {
      const remoteLotusVersions = await getCurrentLotusVersion();
      const thisIndex = remoteLotusVersions.indexOf(lotusVersion);
      if (thisIndex !== 0) {
        //  We need to upgrade Lotus
        updateAvailable = true;
      }
    }

    electronState = {
      lotusVersion,
      missingDependencies,
      updateAvailable,
    };

    mainWindow.webContents.send(
      "electron-state",
      JSON.stringify(electronState)
    );
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

ipcMain.on("launch", async (event, message) => {
  try {
    const { missingDependencies } = electronState;
    if (missingDependencies) {
      mainWindow.webContents.send(
        "launch-updates",
        "Installing dependencies..."
      );
      try {
        await installDependencies(missingDependencies);
      } catch (error) {
        console.log(error);
        mainWindow.webContents.send("launch-updates", "Error while launching");
      }
    }
    await startLotus();
  } catch (error) {
    console.log(error);
    mainWindow.webContents.send("launch-updates", "Error");
  }
});

ipcMain.on('re-launch', async (event, message) => {
  try {
    mainWindow.webContents.send("launch-updates", "Shutting down Lotus...");
    await stopLotus();
    await startLotus();
  } catch (error) {
    console.log(error);
    mainWindow.webContents.send("launch-updates", "Error");
  }
});

ipcMain.on('Check lotus', async (event, message) => {
  try {
    const state = await checkLotusState();
    mainWindow.webContents.send("Lotus state", state);
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on('Check dependencies', async (even, message) => {
  try {
    const missingDependencies = await checkOnDependencies();
    electronState.missingDependencies = missingDependencies;
    mainWindow.webContents.send(
      "electron-state",
      JSON.stringify(electronState)
    );
  } catch (error) {
    console.log(error);
  }
})
app.on("ready", createWindow);
