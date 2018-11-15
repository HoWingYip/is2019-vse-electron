//define "playing" property of video
//shoutout to my saviour, Raees Bhatti, on StackOverflow
Object.defineProperty(HTMLMediaElement.prototype, "playing", {
  get: function() {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
});

window.onload = () => {
  //initialise timeline video, scrubber & play/pause button elements as JS vars
  var timelineVideo = document.getElementById("timeline-video");
  var timelineScrubber = document.getElementById("timelineScrubber");
  var timelinePlayPauseButton = document.getElementById("timelinePlayPause");

  //initialise source video, scrubber & play/pause button elements as JS vars
  var sourceVideo = document.getElementById("source-video");
  var sourceScrubber = document.getElementById("sourceScrubber");
  var sourcePlayPauseButton = document.getElementById("sourcePlayPause");

  /* play/pause icon change functions */

  //update timeline play/pause button
  timelineVideo.onplay = () => {
    timelinePlayPauseButton.src = "icons/pngs/Pause.png";
  };
  timelineVideo.onpause = () => {
    timelinePlayPauseButton.src = "icons/pngs/Play.png";
  };

  //update source play/pause button
  sourceVideo.onplay = () => {
    sourcePlayPauseButton.src = "icons/pngs/Pause.png";
  };
  sourceVideo.onpause = () => {
    sourcePlayPauseButton.src = "icons/pngs/Play.png";
  };

  /* seek bar update function */
  //credits: https://blog.teamtreehouse.com/building-custom-controls-for-html5-videos

  //timeline video scrubber code

  //scrub video on scrubber drag
  timelineScrubber.addEventListener("change", () => {
    timelineVideo.currentTime = timelineVideo.duration * (timelineScrubber.value / 100);
  });

  //move scrubber as video plays
  timelineVideo.addEventListener("timeupdate", () => {
    timelineScrubber.value = 100 / timelineVideo.duration * timelineVideo.currentTime;
  });

  //pause video while scrubber is being dragged, and
  //play it when it stops being dragged
  timelineScrubber.addEventListener("mousedown", () => {
    timelineVideo.pause();
  });

  //source video scrubber code

  //scrub video on scrubber drag
  sourceScrubber.addEventListener("change", () => {
    sourceVideo.currentTime = sourceVideo.duration * (sourceScrubber.value / 100);
  });

  //move scrubber as video plays
  sourceVideo.addEventListener("timeupdate", () => {
    sourceScrubber.value = 100 / sourceVideo.duration * sourceVideo.currentTime;
  });

  //pause video while scrubber is being dragged, and
  //play it when it stops being dragged
  sourceScrubber.addEventListener("mousedown", () => {
    sourceVideo.pause();
  });

  /* timer update functions */

  //timeline timer code
  var timelineCurrentTimeIndicator = document.getElementById("timelineCurrentTime");
  var timelineDurationIndicator = document.getElementById("timelineDuration");

  //show timeline video duration
  if(timelineVideo.duration < 60) {
    timelineDurationIndicator.innerHTML = "0:" + Math.floor(timelineVideo.duration);
  } else if (timelineVideo.duration >= 60) {
    var timelineDurationMinutes = Math.floor(timelineVideo.duration / 60);
    var timelineDurationSeconds = Math.floor(timelineVideo.duration - timelineDurationMinutes * 60);
    timelineDurationIndicator.innerHTML = timelineDurationMinutes + ":" + timelineDurationSeconds;
  }

  //update timeline current time indicator
  timelineVideo.addEventListener("timeupdate", () => {
    if(timelineVideo.duration < 60) {
      timelineCurrentTimeIndicator.innerHTML = "0:" + ("0" + Math.floor(timelineVideo.currentTime)).slice(-2); /* formats seconds value to 2 digits */
    } else if(timelineVideo.duration >= 60) {
      var currentMinutes = Math.floor(timelineVideo.currentTime / 60);
      var currentSeconds = Math.floor(timelineVideo.currentTime - currentMinutes * 60);
      timelineCurrentTimeIndicator.innerHTML = currentMinutes + ":" + ("0" + Math.floor(currentSeconds)).slice(-2);
    }
  });

  //source timer code
  var sourceCurrentTimeIndicator = document.getElementById("sourceCurrentTime");
  var sourceDurationIndicator = document.getElementById("sourceDuration");

  //show source video duration
  if(sourceVideo.duration < 60) {
    sourceDurationIndicator.innerHTML = "0:" + Math.floor(sourceVideo.duration);
  } else if (sourceVideo.duration >= 60) {
    var sourceDurationMinutes = Math.floor(sourceVideo.duration / 60);
    var sourceDurationSeconds = Math.floor(sourceVideo.duration - sourceDurationMinutes * 60);
    sourceDurationIndicator.innerHTML = sourceDurationMinutes + ":" + sourceDurationSeconds;
  }

  //update source current time indicator
  sourceVideo.addEventListener("timeupdate", () => {
    if(sourceVideo.duration < 60) {
      sourceCurrentTimeIndicator.innerHTML = "0:" + ("0" + Math.floor(sourceVideo.currentTime)).slice(-2); /* formats seconds value to 2 digits */
    } else if(sourceVideo.duration >= 60) {
      var currentMinutes = Math.floor(sourceVideo.currentTime / 60);
      var currentSeconds = Math.floor(sourceVideo.currentTime - currentMinutes * 60);
      sourceCurrentTimeIndicator.innerHTML = currentMinutes + ":" + ("0" + Math.floor(currentSeconds)).slice(-2);
    }
  });

  
};

/* skip to start functions */

function timelineSkipToStart() {
  var timelineVideo = document.getElementById("timeline-video");
  
  timelineVideo.pause();
  timelineVideo.currentTime = 0;
}

function sourceSkipToStart() {
  var sourceVideo = document.getElementById("source-video");

  sourceVideo.pause();
  sourceVideo.currentTime = 0;
}

/* skip 10 frames back functions */
//get fps of video? seems extremely hard in HTML5
//might consider porting this to Electron

function timelineSkipTenBack() {

}

function sourceSkipTenBack() {

}

/* play/pause functions */

function timelinePlayPause() {
  //initialise video element as JS var
  var timelineVideo = document.getElementById("timeline-video");

  //play the video
  if(timelineVideo.playing) {
    timelineVideo.pause();
  } else if(timelineVideo.paused) {
    timelineVideo.play();
  }
}

function sourcePlayPause() {
  //initialise video element as JS var
  var sourceVideo = document.getElementById("source-video");

  //play the video
  if(sourceVideo.playing) {
    sourceVideo.pause();
  } else if(sourceVideo.paused) {
    sourceVideo.play();
  }
}

/* fast-forward function */

function timelineSkipTenForward() {

}

function sourceSkipTenForward() {

}

/* skip to end functions */

function timelineSkipToEnd() {
  var timelineVideo = document.getElementById("timeline-video");

  timelineVideo.pause();
  timelineVideo.currentTime = timelineVideo.duration;
}

function sourceSkipToEnd() {
  var sourceVideo = document.getElementById("source-video");

  sourceVideo.pause();
  sourceVideo.currentTime = sourceVideo.duration;
}
