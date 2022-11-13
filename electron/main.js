require('@electron/remote/main').initialize();
const { app, globalShortcut, Menu, Tray, BrowserWindow, nativeImage, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const settings = require('./scripts/settings');
const win = require('./scripts/win');

let tray = null;
let mainWindow = null;
let canQuit = false;
let options;

const gotTheLock = app.requestSingleInstanceLock();

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1025,
    height: 575,
    minWidth: 730,
    minHeight: 450,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
};

const createTrayIcon = () => {
  let iconPath = isDev ? path.join(__dirname, '../public/assets/icon.ico') : path.join(__dirname, '../vite-dist/assets/icon.ico');

  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Reminder',
      icon: nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 }),
      click: () => {
        win.showOrRestore(mainWindow);
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        canQuit = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Reminder');

  tray.on('click', () => {
    win.showOrRestore(mainWindow);
  });

  tray.setContextMenu(contextMenu);
};

if (!gotTheLock && !isDev) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      win.showOrRestore(mainWindow);
    }
  });

  app.whenReady().then(() => {
    createWindow();
    createTrayIcon();

    options = settings.loadSettings();

    if (options.maximized) {
      mainWindow.maximize();
    }

    if (options.startMinimized) {
      mainWindow.hide();
    }

    if (process.platform === 'win32') {
      app.setAppUserModelId(app.name);
    }

    if (!isDev) {
      app.setLoginItemSettings({ openAtLogin: true });
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    require('@electron/remote/main').enable(mainWindow.webContents);

    if (!isDev) {
      mainWindow.loadFile(path.join(__dirname, '../vite-dist/index.html'));
    } else {
      mainWindow.loadURL('http://127.0.0.1:5173/');
    }

    mainWindow.on('maximize', () => {
      options.maximized = true;
      settings.saveSettings(options);
    });

    mainWindow.on('unmaximize', () => {
      options.maximized = false;
      settings.saveSettings(options);
    });

    mainWindow.on('close', (event) => {
      if (canQuit) {
        return;
      }

      event.preventDefault();
      mainWindow.hide();
    });

    mainWindow.on('app-command', (e, cmd) => {
      if (cmd === 'media-play-pause') {
        e.preventDefault();
      }
    });

    ipcMain.on('show-or-restore', () => {
      win.showOrRestore(mainWindow);
    });

    ipcMain.on('set-option', (event, optionName, value) => {
      options[optionName] = value;
      settings.saveSettings(options);
    });

    ipcMain.on('get-option', (event, optionName) => {
      event.returnValue = options[optionName];
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return;
  }

  app.quit();
});

app.on('browser-window-focus', function () {
  if (!isDev) {
    globalShortcut.register('CommandOrControl+R', () => {});
  }

  globalShortcut.register('F5', () => {});
});

app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R');
  globalShortcut.unregister('F5');
});
