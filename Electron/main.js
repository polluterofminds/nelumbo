require("dotenv").config();
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const {
  checkOnDependencies,
  getLocalLotusVersion,
  getCurrentLotusVersion,
  installDependencies,
  startWorkers,
  startMiner,
  checkLotusState,
  upgradeLotus,
  stopLotus,
  getLotusToken,
  createWallets,
  updateConfig,
  startIPFS,
} = require("./cli");
const isOnline = require("is-online");
const { ExceptionlessClient } = require("exceptionless");
const client = ExceptionlessClient.default;
client.config.apiKey = process.env.EXCEPTIONLESS_KEY
const fixPath = require("fix-path");
fixPath();
let mainWindow;
let electronState;
let lotusConfig;

try {
  require("electron-reloader")(module);
} catch (_) {}

const startLotus = async (existingRepo, config) => {
  try {
    if (config) {
      mainWindow.webContents.send(
        "launch-updates",
        "Updating lotus configuration..."
      );
      await updateConfig(config);
    }
    mainWindow.webContents.send("launch-updates", "Starting workers...");
    await startWorkers(existingRepo);
    mainWindow.webContents.send("launch-updates", "Starting miner...");
    await startMiner();
    mainWindow.webContents.send("launch-updates", "Creating wallets...");
    await createWallets();
    mainWindow.webContents.send("launch-updates", "Done");
  } catch (error) {
    client.submitException(error);
    throw error;
  }
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
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
    : `file://${path.join(__dirname, "/../build/index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", async () => {
    try {
      mainWindow.show();
      client.submitLog("Nelumbo Loaded");
      const online = await isOnline();
      let lotusVersion;
      let updateAvailable = false;
      let missingDependencies = [];
      try {
        missingDependencies = await checkOnDependencies();
      } catch (error) {
        client.submitException(error);
      }
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
      mainWindow.on("closed", async () => {
        await stopLotus();
        mainWindow = null;
      });
    } catch (error) {
      client.submitException(error);
    }
  });
};

ipcMain.on("Update Config", async (event, message) => {
  lotusConfig = message;
});

ipcMain.on("Start IPFS", async (event, message) => {
  await startIPFS();
  mainWindow.webContents.send("ipfs update", "ipfs running");
});

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
        client.submitException(error);
        mainWindow.webContents.send("launch-updates", "Error while launching");
      }
    }

    const existingLotusRepo =
      missingDependencies.filter((dep) => dep.reason === "lotus").length === 0;
    await startLotus(existingLotusRepo, lotusConfig);
  } catch (error) {
    console.log(error);
    client.submitException(error);
    mainWindow.webContents.send("launch-updates", "Error");
  }
});

ipcMain.on("re-launch", async (event, message) => {
  try {
    mainWindow.webContents.send("launch-updates", "Shutting down Lotus...");
    await stopLotus();
    await startLotus();
  } catch (error) {
    console.log(error);
    client.submitException(error);
    mainWindow.webContents.send("launch-updates", "Error");
  }
});

ipcMain.on("Get state", async (event, message) => {
  mainWindow.webContents.send("electron-state", JSON.stringify(electronState));
});

ipcMain.on("Check lotus", async (event, message) => {
  try {
    const state = await checkLotusState();
    mainWindow.webContents.send("Lotus state", state);
  } catch (error) {
    client.submitException(error);
    console.log(error);
  }
});

ipcMain.on("Check dependencies", async (event, message) => {
  try {
    const missingDependencies = await checkOnDependencies();
    electronState.missingDependencies = missingDependencies;
    mainWindow.webContents.send(
      "electron-state",
      JSON.stringify(electronState)
    );
  } catch (error) {
    client.submitException(error);
    console.log(error);
  }
});

ipcMain.on("Upgrade lotus", async (event, message) => {
  try {
    await upgradeLotus();
    mainWindow.webContents.send("Upgrade complete");
    electronState.updateAvailable = false;
    mainWindow.webContents.send(
      "electron-state",
      JSON.stringify(electronState)
    );
  } catch (error) {
    console.log(error);
    client.submitException(error);
    mainWindow.webContents.send("launch-updates", "Error");
  }
});

ipcMain.on("get-token", async (event, message) => {
  try {
    console.log("getting the token");
    const token = await getLotusToken();
    console.log(token);
    mainWindow.webContents.send("received-token", token);
  } catch (error) {
    client.submitException(error);
    console.log(error);
  }
});

ipcMain.on("Open link", async (event, message) => {
  shell.openExternal(message);
});
app.on("ready", createWindow);
