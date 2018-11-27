var fs = require("fs");
const {ipcMain} = require("electron");
const ffmpeg = require("ffmpeg");
const {dialog} = require("electron");

var importedFiles = new Array();

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
        for(var filename of files) {
          //add files to imported files array
          importedFiles.push(filename);
        }
      } catch(e) {
        console.error(e);
        /*
        bug: if import is cancelled,
        "files is not iterable" is thrown
        can't do crap about that...
        */
      }
      console.log(`importedFiles array: \n${importedFiles}\n\n`);
      importedAssetsRequest.sender.send("importedAssetsSend", importedFiles);
    });
  } catch(e) {
    console.error(e);
  }
});

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
