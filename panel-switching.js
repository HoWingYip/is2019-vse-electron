// init elements
const sourcePanelContainer = document.getElementById("panel-container-source");
const mediaPanelContainer = document.getElementById("panel-container-media");
const sourceSwitcher = document.getElementById("switchSource");
const mediaSwitcher = document.getElementById("switchMedia");

// switch to source panel in div.video-panel
const switchSource = () => {
  // display source video container
  sourcePanelContainer.style.display = "inline-block";
  // hide media browser
  mediaPanelContainer.style.display = "none";

  // enable source switcher
  sourceSwitcher.classList.add("panel-switcher-enabled");
  // disable media switcher
  mediaSwitcher.classList.remove("panel-switcher-enabled");
};

// switch to media panel in div.video-panel
const switchMedia = () => {
  // hide source video container
  sourcePanelContainer.style.display = "none";
  // display media browser
  mediaPanelContainer.style.display = "inline-block";

  // disable source switcher
  sourceSwitcher.classList.remove("panel-switcher-enabled");
  // enable media switcher
  mediaSwitcher.classList.add("panel-switcher-enabled");
};
