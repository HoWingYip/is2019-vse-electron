const {dialog} = require("electron");

const showImportDialog = () => {
  return dialog.showOpenDialog({
    title: "Import",
    defaultPath: "~/",
    buttonLabel: "Import",
    filters: [
      {name: "All Supported Files", extensions: ["mp4", "mov", "ogg", "webm", "m4v", "wav", "mp3", "webm", "aac", "flac", "m4a", "ogg", "oga", "opus", "png", "jpg", "jpeg", "bmp", "gif", "webp"]},
      {name: "Video Files", extensions: ["mp4", "mov", "ogg", "webm", "m4v"]},
      {name: "Audio Files", extensions: ["wav", "mp3", "webm", "aac", "flac", "m4a", "ogg", "oga", "opus"]},
      {name: "Image Files", extensions: ["png", "jpg", "jpeg", "bmp", "gif", "webp"]}
    ],
    properties: ["openFile", "multiSelections"],
  });
};

const showAssetNameConflictsError = () => {
  dialog.showMessageBox({
    type: "error",
    title: "Error: no files were imported",
    message: "An asset with the same filename has already been imported. " +
    "Please rename the file you are trying to import, or delete the " +
    "conflicting asset in the Media Browser to import this file.",
  });
};

module.exports = {
  showImportDialog,
  showAssetNameConflictsError,
};
