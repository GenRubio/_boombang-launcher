const {
  app,
  BrowserWindow,
  globalShortcut,
  session,
  ipcMain
} = require("electron");

const path = require("path");
const launcherUrl = 'http://localhost:5439/';

let mainWindow;
let gameWindow = null;
var iconpath = path.join(__dirname, "icon.ico");
var pjson = require(__dirname + "/package.json");
let pluginName;

if (require("electron-squirrel-startup")) {
  app.quit();
}

switch (process.platform) {
  case "win32":
    pluginName = "flash/pepflashplayer.dll";
    break;
  case "darwin":
    pluginName = "flash/PepperFlashPlayer.plugin";
    break;
  case "linux":
    pluginName = "flash/libpepflashplayer.so";
    break;
}
app.commandLine.appendSwitch(
  "ppapi-flash-path",
  path.join(__dirname, pluginName)
);

const createWindow = () => {
  let height = 687 + 50;
  let width = 1019 + 315;
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: width,
    height: height,
    icon: iconpath,
    title: "BoomBang Launcher",
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
    },
    show: false,
    frame: true,
    backgroundColor: pjson.backgroundColor,
    resizable: false,
  });

  mainWindow.loadURL(launcherUrl);
  mainWindow.setMenu(null);
  mainWindow.show();

  mainWindow.webContents.on("did-finish-load", () => { });

  mainWindow.on("closed", (event) => {
    mainWindow = null;
  });
};

app.on("ready", () => {
  createWindow();
  globalShortcut.register("f5", function () {
    let win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.reload();
    }
  });
  globalShortcut.register("f1", function () {
    let win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.show();
    }
  });
  globalShortcut.register("f3", function () {
    let win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.toggleDevTools();
    }
  });
  globalShortcut.register("f2", function () {
    session.defaultSession.clearCache();
  });
});