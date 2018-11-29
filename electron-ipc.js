const {ipcRenderer} = require("electron");

var importedFiles = new Array();

function importAssets() {
  ipcRenderer.send("importAssets");
}

ipcRenderer.on("importedAssetsSend", (_, newlyImportedFiles) => {
  console.log(`Newly imported files: \n${newlyImportedFiles}\n\n`);
  for(var filename of newlyImportedFiles) {
    importedFiles.push(filename);
  }
  console.log(`importedFiles array: \n${importedFiles}\n\n`);
  //hide "no files imported" placeholder if files were actually imported
  if(importedFiles.length > 0) {
    document.getElementsByClassName("placeholder-fullheight")[0].style.display = "none";
    document.getElementById("assets").style.display = "table";
  }
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