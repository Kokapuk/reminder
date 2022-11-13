const showOrRestore = (win) => {
  win.setAlwaysOnTop(true);
  win.setAlwaysOnTop(false);

  if (!win.isVisible()) {
    win.show();
    return;
  }

  if (win.isMinimized()) {
    win.restore();
    return;
  }
};

module.exports = { showOrRestore };
