const path = require('path');
const fs = require('fs');
const { app } = require('electron');

const settingsPath = path.join(app.getPath('appData'), './Reminder/settings.json');
const defaultSettings = { maximized: false, startMinimized: true };

const loadSettings = () => {
  try {
    let loadedSettings = fs.readFileSync(settingsPath);
    loadedSettings = JSON.parse(loadedSettings);

    return loadedSettings;
  } catch {
    saveSettings(defaultSettings);

    return defaultSettings;
  }
};

const saveSettings = (settingsToSave) => {
  fs.writeFileSync(settingsPath, JSON.stringify(settingsToSave));
};

module.exports = { loadSettings, saveSettings };
