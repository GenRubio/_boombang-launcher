const { app, BrowserWindow, globalShortcut, session, ipcMain, Menu } = require("electron");
const path = require("path");

const launcherUrl = 'http://localhost:5439/';
const iconpath = path.join(__dirname, "icon.ico");
const pjson = require(__dirname + "/package.json");
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

app.commandLine.appendSwitch("ppapi-flash-path", path.join(__dirname, pluginName));

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1019,
    height: 687,
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

  mainWindow.webContents.on("did-finish-load", () => {});

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Menú para abrir las DevTools
  const menu = Menu.buildFromTemplate([
    {
      label: 'Developer',
      submenu: [
        { role: 'toggleDevTools' },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
};

const createGameWindow = () => {
  if (gameWindow !== null) return;

  const gameWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1219,
    height: 887,
    icon: iconpath,
    title: "BoomBang Game",
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
    },
    show: false,
    frame: true,
    backgroundColor: pjson.backgroundColor,
    resizable: true,
  });

  gameWindow.loadURL(launcherUrl);
  gameWindow.setMenu(null);
  gameWindow.show();

  gameWindow.toggleDevTools();

  gameWindow.webContents.on("did-finish-load", () => {});
  gameWindow.on("closed", () => {
    gameWindow = null;
  });

  // Menú para abrir las DevTools
  const menu = Menu.buildFromTemplate([
    {
      label: 'Developer',
      submenu: [
        { role: 'toggleDevTools' },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
};

app.on("ready", () => {
  createWindow();
  globalShortcut.register("f5", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.reload();
    }
  });

  globalShortcut.register("f1", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.show();
    }
  });

  globalShortcut.register("f3", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.toggleDevTools();
    }
  });

  globalShortcut.register("f2", () => {
    session.defaultSession.clearCache();
  });
});

ipcMain.on('open-window', () => {
  createGameWindow();
});
