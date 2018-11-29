var fs = require("fs");
const {ipcMain} = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const {dialog} = require("electron");

var importedFiles = new Array();
var videos = new Array();

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
          for(var fileNumber in files) {
            //add file to list of imported files
            importedFiles.push(files[fileNumber]);
            videos = importedFiles;
          }
        }
      } catch(e) {
        console.error(e);
      }
      console.log(`importedFiles array: \n${importedFiles}\n\n`);
      //notify ipcRenderer of file import
      importedAssetsRequest.sender.send("importedAssetsSend", importedFiles);
      frameExtractionTest();
    });
  } catch(e) {
    console.error(e);
  }
});

function frameExtractionTest() {
  //create new ffmpeg instance for every video
  //with path to video file
  for(var fileNumber in videos) {
    videos[fileNumber] = new ffmpeg(videos[fileNumber]);
    videos[fileNumber].on("filenames", (filenames) => {
      console.log("Generating thumbnails: " + filenames.join(", "));
    }).on("end", () => {
      console.log("Thumbnails generated");
    }).screenshots({
      timestamps: [JSON.stringify(Math.random()) + "%"],
      count: 1,
      filename: "thumbnail-%b", //generate file with name "thumbnail-(filename)"
      folder: "saved-frames-test/"
    });
  }
}

/*
function frameExtractionTest() {
  for(var file of importedFiles) {
    console.log(file);
    try {
      var videoProcess = new ffmpeg(file);
      videoProcess.then((video) => {
        video.fnExtractFrameToJPG("saved-frames-test/", {
          frame_rate: 1,
          number: 1,
          file_name: "frame_%t_%s"
        }, (err, frames) => {
          if(err) throw err;
          console.log("Frames: " + frames);
        });
      }, (err) => {
        console.error(err);
      });
    } catch(e) {
      //error occurs here!
      //ok, bug is with ffmpeg package...
      //js escaping of file path with \\ causes "input file does not exist" error
      //considering forking ffmpeg module, might PR back.
      console.error(e);
    }
  }
}
*/

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
