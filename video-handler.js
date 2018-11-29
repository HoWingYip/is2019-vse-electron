const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const {ipcMain} = require("electron");
const {dialog} = require("electron");

var importedFiles = new Array();
var ffmpegProcesses = new Array();

//show import dialog on click of import area
ipcMain.on("importAssets", (importedAssetsRequest) => {
  try {
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
      console.log(`Files selected: \n${files}\n\n`);
      try {
        //check that import was not cancelled
        //to avoid throwing "files is not iterable"
        if(files !== undefined) {
          //add newly imported files to file list
          for(var filename of files) {
            //write details to object in array
            importedFiles.push(
              {filename: filename, thumbnail: ""}
            );
          }
          console.log(importedFiles);
        }
      } catch(e) {
        console.error(e);
      }
      console.log(`importedFiles array: \n${importedFiles}\n\n`);
      //notify ipcRenderer of file import
      importedAssetsRequest.sender.send("importedAssetsSend", importedFiles);
      extractThumbnails();
    });
  } catch(e) {
    console.error(e);
  }
});

function extractThumbnails() {
  //create new ffmpeg instance for every video
  //with path to video file
  for(var fileNumber in importedFiles) {
    //if thumbnail already exists, don't generate it again
    //could bug out by showing old thumbnail if file was changed but still has same name
    //CHANGE TO USE SHA512 OF FILE INSTEAD
    if(!fs.existsSync("saved-frames-test/thumbnail-" + path.basename(importedFiles[fileNumber].filename) + ".png")) {
      ffmpegProcesses[fileNumber] = new ffmpeg(importedFiles[fileNumber].filename);
      ffmpegProcesses[fileNumber].on("filenames", (filenames) => {
        //set thumbnail paths
        for(var thumbnailNumber in filenames) {
          importedFiles[thumbnailNumber].thumbnail = filenames[thumbnailNumber];
          console.log(filenames[thumbnailNumber]);
        }
        console.log("Generating thumbnails: " + filenames.join(", "));
      }).on("end", () => {
        console.log("Thumbnails generated");
      }).screenshots({
        timestamps: [JSON.stringify(Math.random()) + "%"],
        count: 1,
        filename: "thumbnail-%f", //generate file with name "thumbnail-(filename)"
        folder: "saved-frames-test/"
      }).on("error", (err, stdout, stderr) => {
        console.error(err);
        if(stderr) console.error(`FFmpeg encountered an error:\n${stderr}\n\n`);
        if(stdout) console.error(`FFmpeg output:\n${stdout}\n\n`);
      });
    }
  }
}

/*
var sourceVideoMetadata;
var timelineVideoMetadata;

try {
  var videoProcess = new ffmpeg('assets/PostingLetter.MOV'); //placeholder file path
  //later, implement dialog for user to input file path.
  //replace this file path with that later
	videoProcess.then((video) => {
    //store source video metadata
    sourceVideoMetadata = video.metadata;
	}, function(err) {
		console.log('Error: ' + err);
	});
} catch(e) {
	console.log(e.code);
	console.log(e.msg);
}

ipcMain.on("sourceMetadataRequest", (event) => {
  console.log("message received");
  event.sender.send("sourceMetadataSend", sourceVideoMetadata);
});
*/
