const {ipcRenderer} = require("electron");

function importAssets() {
  ipcRenderer.send("importAssets");
}

ipcRenderer.on("importedAssetsSend", (_, importedFiles) => {
  console.log(importedFiles);
  console.log("holy crap imported files was actually received?!?!");
});

/*
//request source video metadata on page load
(() => {
  ipcRenderer.send("sourceMetadataRequest");
})();

ipcRenderer.on("sourceMetadataSend", (_, sourceVideoMetadata) => {
  console.log(sourceVideoMetadata);
});
*/