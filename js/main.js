var facetracker = null;
var sb = null;

$(document).ready(function(){
	// setup facetracker
	facetracker = new FaceTracker();
	facetracker.setup();

	// setup spacebrew
	sb = new Spacebrew.Client();

	facetracker.update = function(){
		var positions = facetracker.tracker.getCurrentPosition();
		if (!positions) return;
	}

});


var FaceTracker = function(){};

FaceTracker.prototype.setup = function(div, canvas) {
	// build video element
	var parentDiv = null;
	if ( div != null ){
		parentDiv = div;
	} else {
		parentDiv = document.createElement("cameraParent");
		document.body.appendChild(parentDiv);
	}
	var videoElement = document.createElement("video");
	videoElement.id = "videoEl";
	videoElement.width = 400;
	videoElement.height = 300;
	parentDiv.appendChild(videoElement);

	if ( canvas != null ){
		this.canvas = canvas;
	} else {
		this.canvas = document.createElement("canvas");
		this.canvas.id 		= "faceCanvas";
		this.canvas.width 	= 400;
		this.canvas.height 	= 300;
		this.canvas.style.position 	= "absolute";
		this.canvas.style.left 		= "0px";
		this.canvas.style.top 		= "0px";
		parentDiv.appendChild(this.canvas);
	}

	this.context = this.canvas.getContext('2d');

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

	// check for camerasupport
	if (navigator.getUserMedia) {
		// set up stream
		
		var videoSelector = {video : true};
		if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
			var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
			if (chromeVersion < 20) {
				videoSelector = "video";
			}
		};
	
		var getMediaSucceeded = false;

		navigator.getUserMedia(videoSelector, function( stream ) {
			if (videoElement.mozCaptureStream) {
				videoElement.mozSrcObject = stream;
			} else {
				videoElement.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
			}
			videoElement.play();
			getMediaSucceeded = true;
		}, function() {
			//insertAltVideo(vid);
			alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
			getMediaSucceeded = false;
		});
	} else {
		//insertAltVideo(vid);
		alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
		return;
	}

	function startVideo() {
		// start video
		videoElement.play();
		// start tracking
		this.tracker.start(videoElement);
		// start loop to draw face
		this.draw();
	}


	this.tracker = new clm.tracker({useWebGL : true});
	this.tracker.init(pModel);
	videoElement.addEventListener('canplay', startVideo.bind(this), false);

	this.tracker.start(videoElement);
	// start loop to draw face
	this.draw();
};

FaceTracker.prototype.draw = function() {
	requestAnimFrame(this.draw.bind(this));
	this.context.clearRect(0, 0, 400, 300);
	//psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
	if (this.tracker.getCurrentPosition()) {
		this.tracker.draw(this.canvas);
	}
	var cp = this.tracker.getCurrentParameters();
	this.update();
};

FaceTracker.prototype.update = function() {
	// plz override me
};

