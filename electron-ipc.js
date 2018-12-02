const {ipcRenderer} = require("electron");

var importedFiles = new Array();

function importAssets() {
  ipcRenderer.send("importAssets");
}

ipcRenderer.on("importedAssetsSend", (_, newImportedFiles) => {
  importedFiles = newImportedFiles;
  console.log(newImportedFiles);
  //if there are imported assets, display them!
  if(importedFiles.length > 0) {
    displayAssets();
  }
});

function displayAssets() {
  //hide the "no assets imported" placeholder
  document.getElementsByClassName("placeholder-fullheight")[0].style.display = "none";
  //display table of assets
  document.getElementById("assets").style.display = "table";
}

ipcRenderer.on("displayImportInProgress", () => {
  //change "no assets imported" to "importing..."
  document.getElementsByClassName("placeholder-fullheight")[0].innerHTML = "Importing...";
});
