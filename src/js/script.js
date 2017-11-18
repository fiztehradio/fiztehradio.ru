// Get Typekit fonts
try {
	Typekit.load({async: true});
} catch (e) {
}

// Stream control functions
var player;
// var planet;

// player.onerror = function() {
//     alert("Error! Something went wrong");
// };

function play() {
	player.volume = 1;
	player.play();
	yaCounter46493418.reachGoal('PLAY');
}

function pause() {
	player.pause();
	yaCounter46493418.reachGoal('PAUSE');
}

// alert("6");

window.onload = function () {
	var planet = $('#mipt-planet');
	var button = $('#play-button');

	button.click(function () {

		if (button.hasClass("play")) {
			button.removeClass("play");
			button.addClass("pause");
			document.getElementById("mipt-planet").style.animationPlayState = "running";
			play();
		}
		else {
			button.removeClass("pause");
			button.addClass("play");
			document.getElementById("mipt-planet").style.animationPlayState = "paused";
			pause();
		}

	});
};

// Ыcript to refresh the current Artist Track
$(document).ready(function () {

	player = document.getElementById("player");

	var trackInfo = $("#current-track-info");
	trackInfo.load("php/icecast-current-track.php");
	setInterval(function () {
		trackInfo.load("php/icecast-current-track.php");
	}, 5 * 1000);

	//set initial state.
	var schemeSwtich = $("#color-scheme-switch");
	schemeSwtich.val(false);

	schemeSwtich.change(function () {
		if (this.checked) {
			$(".night-color-scheme").each(function () {
				$(this).removeClass("night-color-scheme");
				$(this).addClass("day-color-scheme");
				$("#circles-day").css("opacity", 1);

			});
		}
		else {
			$(".day-color-scheme").each(function () {
				$(this).removeClass("day-color-scheme");
				$(this).addClass("night-color-scheme");
				$("#circles-day").css("opacity", 0);
			});
		}
		schemeSwtich.val(this.checked);

	});
});