const {ipcRenderer} = require("electron");

let importedFiles = [];
let selectedFiles = [];

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
    assetTableCell.className = "asset-tile";
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

/* display assets in video player function */

function displayAssetInPlayer(assetPath) {
  // switch to source video panel
  switchSource();

  const sourcePlaceholder = document.getElementsByClassName("placeholder")[0];
  // hide "Select a video" placeholder
  sourcePlaceholder.style.display = "none";

  const sourceVideo = document.getElementById("source-video");
  // put video into video player!
  sourceVideo.src = assetPath;

  // takes away width="100%" attribute of video to prevent unintentional letterboxing/pillarboxing in UI
  sourceVideo.width = "auto";
  // aligns video to centre
  sourceVideo.style.marginLeft = "auto";
  sourceVideo.style.marginRight = "auto";

  const sourceVideoContainer = document.getElementsByClassName("video-container")[0];
  // remove source video container's dotted border
  sourceVideoContainer.style.border = "none";
}

/* panel focus/highlighting function */

document.addEventListener("click", (event) => {
  const panels = document.getElementsByClassName("panel");

  function removeFocusAllPanels() {
    for(const panel of panels) {
      panel.classList.remove("panel-focus");
    }
  }

  if(event.target.closest(".panel")) {
    // if clicked region has a panel as nth-level ancestor:
    removeFocusAllPanels();
    // ...and focus that panel
    const panelToFocus = event.target.closest(".panel");
    panelToFocus.classList.add("panel-focus");
  } else {
    removeFocusAllPanels();
  }
});

/* asset tile focus/highlighting function */

document.addEventListener("click", (event) => {
  const assetTiles = document.getElementsByClassName("asset-tile");

  function removeFocusAllTiles() {
    for(const tile of assetTiles) {
      tile.classList.remove("asset-tile-focus");
    }
  }

  function singleTileSelect() {
    const tileToFocus = event.target.closest(".asset-tile");
    tileToFocus.classList.add("asset-tile-focus");
  }

  if(event.target.closest(".asset-tile")) {
    // if click was within a tile...

    if(!event.ctrlKey && !event.shiftKey) {
      // no multi-selection

      // deselect all tiles
      removeFocusAllTiles();
      // select the clicked one
      singleTileSelect();

    } else if(event.ctrlKey) {
      // ctrl key was down: multi-selection

      // add clicked tile to selection
      singleTileSelect();

    } else if(event.shiftKey) {
      // shift key was down: multi-selection

      // if no tiles have been selected, treat this like a normal selection
      // otherwise, "Uncaught TypeError: Cannot read property 'classList' of undefined" is thrown
      if(selectedFiles.length === 0) {
        singleTileSelect();
        return;
      }

      // get index of clicked asset
      // spread operator is used in order to be able to use indexOf on a NodeList
      const clickedAssetIndex = [...assetTiles].indexOf(event.target.closest(".asset-tile"));

      // get index of currently focused tile
      const firstFocusedAsset = document.getElementsByClassName("asset-tile-focus")[0];
      const firstFocusedAssetIndex = [...assetTiles].indexOf(firstFocusedAsset);

      if(clickedAssetIndex < firstFocusedAssetIndex) {
        for(let tileNumberToFocus = clickedAssetIndex; tileNumberToFocus < firstFocusedAssetIndex; tileNumberToFocus++) {
          // selects every tile from clicked tile UP to currently focused tile
          // (if clicked tile comes before currently focused tile)
          assetTiles[tileNumberToFocus].classList.add("asset-tile-focus");
        }
      } else if(firstFocusedAssetIndex < clickedAssetIndex) {
        for(let tileNumberToFocus = firstFocusedAssetIndex; tileNumberToFocus < clickedAssetIndex + 1; tileNumberToFocus++) {
          // selects every tile from currently focused tile UP to clicked tile
          // (if currently focused tile comes before clicked tile)
          // clickedAssetIndex + 1 is to select all tiles up to AND INCLUDING the clicked one
          assetTiles[tileNumberToFocus].classList.add("asset-tile-focus");
        }
      }
    }
    // event.ctrlKey was not dealt with because it requires nothing special
    // (it just selects whichever tile was clicked)

    // store selected assets in array
    const focusedAssetTiles = document.getElementsByClassName("asset-tile-focus");
    // another two spread operators since NodeLists have neither map() nor indexOf() methods
    selectedFiles = [...focusedAssetTiles].map((asset) => [...assetTiles].indexOf(asset));
  } else {
    removeFocusAllTiles();
    selectedFiles = [];
  }
});

// TODO: Implement asset deletion (includes multi-selected assets) - implement other actions later
