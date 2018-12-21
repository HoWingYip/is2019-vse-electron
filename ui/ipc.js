const {ipcRenderer} = require("electron");

function closeWindow() { ipcRenderer.send("window.close"); }
function maximizeWindow() { ipcRenderer.send("window.maximize"); }
function restoreWindow() { ipcRenderer.send("window.restore"); }
function minimizeWindow() { ipcRenderer.send("window.minimize"); }