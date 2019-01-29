const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const hasha = require("hasha");
const {ipcMain} = require("electron");

const dialogs = require("./dialogs.js");

const importedFiles = [];

const checkIfAssetNameConflicts = (newlyImportedAssets) => {
  // get filenames of existing assets
  const existingAssetFilenames = importedFiles.map((asset) => asset.filePath);
  for (const newlyImportedAsset of newlyImportedAssets) {
    if (existingAssetFilenames.includes(newlyImportedAsset)) {
      // show error dialog stopping import if asset has conflicting names
      dialogs.showAssetNameConflictsError();
      // sets assetWithSameNameExists to true
      return true;
    }
  }

  // sets assetWithSameNameExists to false
  return false;
};

// functions to return resolved Promise containing desired value to store
const storeMetadata = (path) => {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = new ffmpeg(path);
    ffmpegProcess.ffprobe((err, metadata) => {
      if (err) reject(Error(err));
      resolve(metadata);
    });
  });
};

const storeHash = (path) => {
  return new Promise((resolve, reject) => {
    const ffmpegProcess = new ffmpeg(path);
    ffmpegProcess.ffprobe((err, metadata) => {
      if (err) reject(Error(err));
      const hash = hasha(JSON.stringify(metadata));
      resolve(hash);
    });
  });
};

const extractThumbnail = (path) => {
  return new Promise((resolve, reject) => {
    let thumbnailPath = "";
    // create new ffmpeg instance for every video
    // with path to video file
    const ffmpegProcess = new ffmpeg(path);
    ffmpegProcess.on("filenames", (filename) => {
      // DON'T FORGET - FILENAME IS AN ARRAY OF LENGTH 1
      // (because this function runs one file at a time)
      console.log("Generating thumbnail: " + filename[0]);
      thumbnailPath = "thumbnails/" + filename[0];
    }).on("end", () => {
      console.log("Thumbnail generated");
      resolve(thumbnailPath);
    }).on("error", (err, stdout, stderr) => {
      console.error(err);
      if (stderr) console.error(`FFmpeg encountered an error:\n${stderr}\n\n`);
      if (stdout) console.error(`FFmpeg output:\n${stdout}\n\n`);
      reject(Error(err));
    }).screenshots({
      // random timestamp for thumbnail
      timestamps: [JSON.stringify(Math.random()) + "%"],
      count: 1,
      // generate file with name "thumbnail-(filename)"
      filename: "thumbnail-%f",
      folder: "thumbnails/",
    });
  });
};

// show import dialog on click of import area
ipcMain.on("importAssets", async (importedAssetsRequest) => {
  // get files selected in dialog
  const files = dialogs.showImportDialog();
  try {
    // check that import was not cancelled
    // to avoid throwing "files is not iterable"
    if (files !== undefined) {
      // change "no assets imported" to "importing..."
      importedAssetsRequest.sender.send("displayImportInProgress");

      // check if asset(s) with same name exist(s)
      const assetWithSameNameExists = checkIfAssetNameConflicts(files);

      for (const filePath of files) {
        if (!assetWithSameNameExists) {
          // add files to list of imported files
          // TODO: display import progress ("Importing file _ of _")
          importedFiles.push({
            filePath, // cool ES6 thingy to represent filePath: filePath
            filename: path.basename(filePath),
            thumbnail: await extractThumbnail(filePath), // replace with `thumbnails/thumbnail-${path.basename(filePath)}`
            metadata: await storeMetadata(filePath),
            lastsha512: await storeHash(filePath),
          });
        }
      }

      if (!assetWithSameNameExists) {
        // put concurrent thumbnail generation code here
        // edit thumbnail function to accept whole files array
        // await returned Promise before displaying assets
      }

      // notify ipcRenderer of file import
      importedAssetsRequest.sender.send("importedAssetsSend", importedFiles);
    }
  } catch (e) {
    console.error(e);
  }
});
