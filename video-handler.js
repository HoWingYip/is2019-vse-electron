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
              thumbnail: await extractThumbnail(filePath).then(thumbnailPath => thumbnailPath), //.then() returns thumbnail path
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
    if(newlyImportedAssetPath === existingAsset.filePath) {
      //show error dialog stopping import if asset has conflicting names
      dialog.showMessageBox({
        type: "error",
        title: "Error: no files were imported",
        message: "An asset with the same filename has already been imported. Please rename the file " +
        "you are trying to import, or delete the conflicting asset in the Media Browser to import this file."
      });

      //sets assetWithSameNameExists to true
      return true;
    }
  }

  //sets assetWithSameNameExists to false
  return false;
}

// functions to return resolved Promise containing desired value to store
function storeMetadata(path) {
  return new Promise(resolve => {
    var ffmpegProcess = new ffmpeg(path);
    ffmpegProcess.ffprobe((err, metadata) => {
      if(err) throw err;
      resolve(metadata);
    });
  });
}

// TODO: implement refactor for hash function
function storeHash(path) {
  return new Promise(resolve => {

  });
}

function extractThumbnail(path) {
  return new Promise(resolve => {
    var thumbnailPath = "";
    //create new ffmpeg instance for every video
    //with path to video file
    var ffmpegProcess = new ffmpeg(path);
    ffmpegProcess.on("filenames", (filename) => {
      //DON'T FORGET - FILENAME IS AN ARRAY OF LENGTH 1
      //(because this function runs one file at a time)
      console.log("Generating thumbnail: " + filename[0]);
      thumbnailPath = "saved-frames-test/" + filename[0];
    }).on("end", () => {
      console.log("Thumbnail generated");
      resolve(thumbnailPath);
    }).on("error", (err, stdout, stderr) => {
      console.error(err);
      if(stderr) console.error(`FFmpeg encountered an error:\n${stderr}\n\n`);
      if(stdout) console.error(`FFmpeg output:\n${stdout}\n\n`);
    }).screenshots({
      timestamps: [JSON.stringify(Math.random()) + "%"], //random timestamp for thumbnail
      count: 1,
      filename: "thumbnail-%f", //generate file with name "thumbnail-(filename)"
      folder: "saved-frames-test/"
    });
  });
}
