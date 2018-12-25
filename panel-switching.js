// switch to source panel in div.video-panel
function switchSource() {
  // display source video container
  document.getElementById("panel-container-source").style.display = "inline-block";
  // hide media browser
  document.getElementById("panel-container-media").style.display = "none";

  // highlight source video tab by applying gradient
  document.getElementById("switchSource").style.backgroundImage = "linear-gradient(rgb(75, 75, 75), rgb(95, 95, 95))";
  // brighten source video tab text colour
  document.getElementById("switchSource").style.color = "rgb(209, 209, 209)";

  // un-highlight media browser tab by taking away gradient
  document.getElementById("switchMedia").style.backgroundImage = "none";
  // darken media browser tab text colour
  document.getElementById("switchMedia").style.color = "rgb(185, 185, 185)";
}

// switch to media panel in div.video-panel
function switchMedia() {
  // hide source video container
  document.getElementById("panel-container-source").style.display = "none";
  // display media browser
  document.getElementById("panel-container-media").style.display = "inline-block";

  // un-highlight source video tab by taking away gradient
  document.getElementById("switchSource").style.backgroundImage = "none";
  // darken source video tab text colour
  document.getElementById("switchSource").style.color = "rgb(185, 185, 185)";

  // highlight media browser tab by applying gradient
  document.getElementById("switchMedia").style.backgroundImage = "linear-gradient(rgb(75, 75, 75), rgb(95, 95, 95))";
  // brighten media browser tab text colour
  document.getElementById("switchMedia").style.color = "rgb(209, 209, 209)";
}
