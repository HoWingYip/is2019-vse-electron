const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const hasha = require("hasha");
const {ipcMain} = require("electron");
const {dialog} = require("electron");

var importedFiles = new Array();
var ffmpegProcesses = new Array();

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
  }, (files) => {
    try {
      //check that import was not cancelled
      //to avoid throwing "files is not iterable"
      if(files !== undefined) {
        for(var fileNumber in files) {
          //add files to list of imported files
          var assetWithSameNameExists = false;
          for(var existingFileNumber in importedFiles) {
            if(files[fileNumber] === importedFiles[existingFileNumber].filename) {
              console.log("asset with same name already exists");
              //show error dialog stopping import if asset has conflicting names
              dialog.showMessageBox({
                type: "error",
                title: "Error: no files were imported",
                message: "An asset with the same filename has already been imported. Please rename the file you are trying to import, or delete the conflicting asset in the Media Browser to import this file."
              });
              assetWithSameNameExists = true;
              //stop the import
              return;
            }
          }
          if(!assetWithSameNameExists) {
            importedFiles.push(
              {filename: files[fileNumber], thumbnail: "", metadata: null, lastsha512: ""}
            );
            storeMetadataAndHash(fileNumber);
            extractThumbnail(fileNumber);
          }
        }
        console.log(importedFiles.length);
        //notify ipcRenderer of file import
        //THIS FUNCTION SUBMITS THE ARRAY WITHOUT METADATA AND STUFF
        //HOW TO MAKE IT RIGHT???
        importedAssetsRequest.sender.send("importedAssetsSend", importedFiles);
      }
    } catch(e) {
      console.error(e);
    }
  });
});

function storeMetadataAndHash(fileNumber) {
  ffmpegProcesses[fileNumber] = new ffmpeg(importedFiles[fileNumber].filename);
  ffmpegProcesses[fileNumber].ffprobe((err, metadata) => {
    if(err) throw err;
    importedFiles[fileNumber].metadata = metadata;
    importedFiles[fileNumber].lastsha512 = hasha(JSON.stringify(metadata));
    console.log(`Metadata for file #${fileNumber}`, importedFiles[fileNumber].metadata);
  });
}

function extractThumbnail(fileNumber) {
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
}
