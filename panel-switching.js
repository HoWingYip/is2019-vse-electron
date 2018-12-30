// init elements
const sourcePanelContainer = document.getElementById("panel-container-source");
const mediaPanelContainer = document.getElementById("panel-container-media");
const sourceSwitcher = document.getElementById("switchSource");
const mediaSwitcher = document.getElementById("switchMedia");

// switch to source panel in div.video-panel
function switchSource() {
  // display source video container
  sourcePanelContainer.style.display = "inline-block";
  // hide media browser
  mediaPanelContainer.style.display = "none";

  // highlight source video tab by applying gradient
  sourceSwitcher.style.backgroundImage = "linear-gradient(rgb(75, 75, 75), rgb(95, 95, 95))";
  // brighten source video tab text colour
  sourceSwitcher.style.color = "rgb(209, 209, 209)";

  // un-highlight media browser tab by taking away gradient
  mediaSwitcher.style.backgroundImage = "none";
  // darken media browser tab text colour
  mediaSwitcher.getElementById("switchMedia").style.color = "rgb(185, 185, 185)";
}

// switch to media panel in div.video-panel
function switchMedia() {
  // hide source video container
  sourcePanelContainer.style.display = "none";
  // display media browser
  mediaPanelContainer.style.display = "inline-block";

  // un-highlight source video tab by taking away gradient
  sourceSwitcher.style.backgroundImage = "none";
  // darken source video tab text colour
  sourceSwitcher.style.color = "rgb(185, 185, 185)";

  // highlight media browser tab by applying gradient
  mediaSwitcher.style.backgroundImage = "linear-gradient(rgb(75, 75, 75), rgb(95, 95, 95))";
  // brighten media browser tab text colour
  mediaSwitcher.style.color = "rgb(209, 209, 209)";
}
