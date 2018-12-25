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
    showImportedAssets();
  }
});

const noAssetsPlaceholder = document.getElementsByClassName("placeholder-fullheight")[0];
const assetTableContainer = document.getElementsByClassName("fullheight-dotted-container")[0];

ipcRenderer.on("displayImportInProgress", () => {
  // change "no assets imported" to "importing..."
  noAssetsPlaceholder.textContent = "Importing...";
  // stop showing import dialog on click
  assetTableContainer.onclick = null;
});

function showImportedAssets() {
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
    // show asset filename on hover
    assetTableCell.title = asset.filename;
    // display asset in video player on double click
    assetTableCell.ondblclick = () => {
      displayAssetInPlayer(asset.filePath);
    };

    // create img element for thumbnail
    const thumbnail = document.createElement("img");
    thumbnail.className = "video-thumbnail";
    thumbnail.src = asset.thumbnail;
    thumbnail.alt = asset.filename;

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
      // append to that row
      document.getElementsByClassName("video-row")[rowNumber].appendChild(assetTableCell);
    }
  }
}

function displayAssetInPlayer(assetPath) {
  // switch to source video panel
  switchSource();

  const sourcePlaceholder = document.getElementsByClassName("placeholder")[0];
  // hide "Select a video" placeholder
  sourcePlaceholder.style.display = "none";

  const sourceVideo = document.getElementById("source-video");
  // put video into video player!
  sourceVideo.src = assetPath;
  // make video easier to differentiate from background by adding border & background colour
  sourceVideo.style.border = "1px solid grey";
  sourceVideo.style.backgroundColor = "#585858";
  // TODO: add padding (?)

  const sourceVideoContainer = document.getElementsByClassName("video-container")[0];
  // remove source video container's dotted border
  sourceVideoContainer.style.border = "none";
}
