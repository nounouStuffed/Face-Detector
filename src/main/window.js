const { BrowserWindow } = require("electron");
const path = require("path");

function createMainWindow() {
  const isDev = !require("electron").app.isPackaged;

  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    backgroundColor: "#111",
    webPreferences: {
      preload: path.resolve(process.cwd(), "src/main/preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  if (isDev) {
    win.loadURL("http://127.0.0.1:5173/");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.resolve(process.cwd(), "dist/renderer/index.html"));
  }

  return win;
}

module.exports = { createMainWindow };
