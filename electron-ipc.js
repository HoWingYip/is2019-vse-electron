const {ipcRenderer} = require("electron");

//request source video metadata on page load
(() => {
  ipcRenderer.send("sourceMetadataRequest");
})();

ipcRenderer.on("sourceMetadataSend", (_, sourceVideoMetadata) => {
  console.log(sourceVideoMetadata);
});