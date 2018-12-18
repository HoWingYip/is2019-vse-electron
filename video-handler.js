const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const hasha = require("hasha");
const {ipcMain} = require("electron");
const {dialog} = require("electron");

var importedFiles = [];

//show import dialog on click of import area
ipcMain.on("importAssets", (importedAssetsRequest) => {
  dialog.showOpenDialog({
    title: "Import",
    defaultPath: "~/",
    buttonLabel: "Import",
    filters: [
      {name: "All Supported Files", extensions: ["mp4", "mov", "ogg", "webm", "m4v", "wav", "mp3", "webm", "aac", "flac", "m4a", "ogg", "oga", "opus", "png", "jpg", "jpeg", "bmp", "gif", "webp"]},
      {name: "Video Files", extensions: ["mp4", "mov", "ogg", "webm", "m4v"]},
      {name: "Audio Files", extensions: ["wav", "mp3", "webm", "aac", "flac", "m4a", "ogg", "oga", "opus"]},
      {name: "Image Files", extensions: ["png", "jpg", "jpeg", "bmp", "gif", "webp"]}
    ],
    properties: ["openFile", "multiSelections"]
  }, async (files) => {
    try {
      //check that import was not cancelled
      //to avoid throwing "files is not iterable"
      if(files !== undefined) {

        //change "no assets imported" to "importing..."
        importedAssetsRequest.sender.send("displayImportInProgress");

        for(var filePath of files) {
          //check if asset(s) with same name exist(s)
          var assetWithSameNameExists = checkIfAssetNameConflicts(filePath);

          if(!assetWithSameNameExists) {
            //add files to list of imported files
            importedFiles.push({
              filePath, //cool ES6 thingy to represent filePath: filePath
              filename: path.basename(filePath),
              thumbnail: "",
              metadata: await storeMetadata(filePath).then(metadata => metadata), // .then() returns metadata
              //TODO: make storeHash() return hash of metadata and store it here
              lastsha512: ""
            });
          }
        }
        //notify ipcRenderer of file import
        importedAssetsRequest.sender.send("importedAssetsSend", importedFiles);
      }
    } catch(e) {
      console.error(e);
    }
  });
});

function checkIfAssetNameConflicts(newlyImportedAssetPath) {
  for(var existingAsset of importedFiles) {
    console.log(existingAsset.filePath);
    if(newlyImportedAssetPath === existingAsset.filePath) {
      console.log("asset with same name already exists");
      //show error dialog stopping import if asset has conflicting names
      dialog.showMessageBox({
        type: "error",
        title: "Error: no files were imported",
        message: "An asset with the same filename has already been imported. Please rename the file " +
        "you are trying to import, or delete the conflicting asset in the Media Browser to import this file."
      });
      return true;
    }
  }
  return false;
}

// FIXME: Hash and thumbnail functions do not work after first import
// to be fixed by refactoring for functions to return resolved Promise
// containing hash & thumbnail path respectively
function storeMetadata(path) {
  return new Promise(resolve => {
    //ffmpegProcesses[fileNumber] = new ffmpeg(importedFiles[fileNumber].filePath);
    console.log(path);
    var ffmpegProcess = new ffmpeg(path);
    ffmpegProcess.ffprobe((err, metadata) => {
      if(err) throw err;
      //importedFiles[fileNumber].metadata = metadata;
      //importedFiles[fileNumber].lastsha512 = hasha(JSON.stringify(metadata));
      //console.log(`Metadata for file ${path}`, metadata);
      resolve(metadata);
    });
  });
}

function storeHash(path) {
  return new Promise(resolve => {

  });
}

function extractThumbnail(fileNumber) {
  return new Promise(resolve => {
    //create new ffmpeg instance for every video
    //with path to video file
    ffmpegProcesses[fileNumber].on("filenames", (filename) => {
      //DON'T FORGET - FILENAME IS AN ARRAY OF LENGTH 1
      //(because this function runs one file at a time)
      //set thumbnail paths
      importedFiles[fileNumber].thumbnail = "saved-frames-test/" + filename[0];
      console.log("Generating thumbnail: " + filename[0]);
    }).on("end", () => {
      console.log("Thumbnail generated");
      resolve("Thumbnails generated.");
    }).on("error", (err, stdout, stderr) => {
      console.error(err);
      if(stderr) console.error(`FFmpeg encountered an error:\n${stderr}\n\n`);
      if(stdout) console.error(`FFmpeg output:\n${stdout}\n\n`);
    }).screenshots({
      timestamps: [JSON.stringify(Math.random()) + "%"],
      count: 1,
      filename: "thumbnail-%f", //generate file with name "thumbnail-(filename)"
      folder: "saved-frames-test/"
    });
  });
}
