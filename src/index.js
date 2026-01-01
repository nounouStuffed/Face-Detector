const { app, BrowserWindow } = require("electron");
const { createMainWindow } = require("./main/window");

app.whenReady().then(() => {
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

