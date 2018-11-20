var fs = require("fs");
const {ipcMain} = require("electron");
const ffmpeg = require("ffmpeg");
const {dialog} = require("electron");

ipcMain.on("importAssets", () => {
  dialog.showOpenDialog({
    title: "Import",
    defaultPath: "~/",
    buttonLabel: "Import",
    filters: [
      {name: "All Supported Files", extensions: ["mp4", "webm", "ogg", "png", "jpg", "jpeg", "bmp", "gif", "wav", "mp3", "mp4"]},
      {name: "Video Files", extensions: ["mp4", "webm", "ogg"]}, /* TODO: find complete list of all file formats of this type */
      {name: "Image Files", extensions: ["png", "jpg", "jpeg", "bmp", "gif"]}, /* TODO: find complete list of all file formats of this type */
      {name: "Audio Files", extensions: ["wav", "mp3", "ogg", "mp4"]} /* TODO: find complete list of all file formats of this type */
    ],
    properties: ["openFile", "multiSelections"]
  });
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
