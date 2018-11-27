const {ipcRenderer} = require("electron");

function importAssets() {
  ipcRenderer.send("importAssets");
}

ipcRenderer.on("importedAssetsSend", (_, importedFiles) => {
  console.log(importedFiles);
  //hide "no files imported" placeholder
  document.getElementsByClassName("placeholder-fullheight")[0].style.display = "none";
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