const {ipcRenderer} = require("electron");

let importedFiles = [];

function importAssets() {
  ipcRenderer.send("importAssets");
}

ipcRenderer.on("importedAssetsSend", (_, newImportedFiles) => {
  importedFiles = newImportedFiles;
  console.log(newImportedFiles);
  // if there are imported assets, display them!
  if(importedFiles.length > 0) {
    displayAssets();
  }
});

const noAssetsPlaceholder = document.getElementsByClassName("placeholder-fullheight")[0];

function displayAssets() {
  // hide the "no assets imported" placeholder
  noAssetsPlaceholder.style.display = "none";
  // display table of assets
  document.getElementById("assets").style.display = "table";
  // clear table before re-displaying all assets
  document.querySelector("table#assets > tbody").innerHTML = "";
  // display the damn assets already!
  for(const asset of importedFiles) {
    const assetTable = document.querySelector("table#assets > tbody");

    // create table cell to contain asset
    const assetTableCell = document.createElement("td");

    // create img element for thumbnail
    const thumbnail = document.createElement("img");
    thumbnail.className = "video-thumbnail";
    thumbnail.src = asset.thumbnail;
    thumbnail.alt = "Thumbnail";

    // create element to display asset name
    const thumbnailLabel = document.createElement("div");
    thumbnailLabel.className = "video-thumbnail-label";
    thumbnailLabel.textContent = asset.filename;

    // assemble completed asset table cell
    assetTableCell.appendChild(thumbnail);
    assetTableCell.appendChild(thumbnailLabel);

    // add new row or not?
    const assetRow = document.createElement("tr");
    assetRow.className = "video-row";
    // if asset will be first in row, add new row
    if(importedFiles.indexOf(asset) % 4 === 0) {
      assetRow.appendChild(assetTableCell);
      assetTable.appendChild(assetRow);
    } else {
      // get # of row to append cell to
      const rowNumber = Math.floor(importedFiles.indexOf(asset) / 4);
      // append
      document.getElementsByClassName("video-row")[rowNumber].appendChild(assetTableCell);
    }
  }
}

ipcRenderer.on("displayImportInProgress", () => {
  // change "no assets imported" to "importing..."
  noAssetsPlaceholder.textContent = "Importing...";
});
