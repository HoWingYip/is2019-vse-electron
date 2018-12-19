const {ipcRenderer} = require("electron");

let importedFiles = [];

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
  //clear table before re-displaying all assets
  document.querySelector("table#assets > tbody").innerHTML = "";
  //display the damn assets already!
  for(var fileNumber in importedFiles) {
    const assetTable = document.querySelector("table#assets > tbody");

    //create table cell to contain asset
    const assetTableCell = document.createElement("td");

    //create img element for thumbnail
    const thumbnail = document.createElement("img");
    thumbnail.className = "video-thumbnail";
    thumbnail.src = importedFiles[fileNumber].thumbnail;
    thumbnail.alt = "Thumbnail";

    //create element to display asset name
    const thumbnailLabel = document.createElement("div");
    thumbnailLabel.className = "video-thumbnail-label";
    thumbnailLabel.innerHTML = importedFiles[fileNumber].filename;

    //add everything to DOM
    assetTableCell.appendChild(thumbnail);
    assetTableCell.appendChild(thumbnailLabel);
    assetTable.appendChild(assetTableCell);

    //TODO: use % 4 (modulo 4) to display assets in rows of 4
  }
}

ipcRenderer.on("displayImportInProgress", () => {
  //change "no assets imported" to "importing..."
  document.getElementsByClassName("placeholder-fullheight")[0].innerHTML = "Importing...";
});
