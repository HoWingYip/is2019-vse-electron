const {ipcRenderer} = require("electron");

function importAssets() {
  ipcRenderer.send("importAssets");
}

//request source video metadata on page load
(() => {
  ipcRenderer.send("sourceMetadataRequest");
})();

ipcRenderer.on("sourceMetadataSend", (_, sourceVideoMetadata) => {
  console.log(sourceVideoMetadata);
});