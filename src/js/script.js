// Get Typekit fonts
try {
	Typekit.load({async: true});
} catch (e) {
}

var player;

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
$(document).ready(function () {

	var button = $('#play-button');

	button.click(function () {

		if (button.hasClass("play")) {
			button.removeClass("play");
			button.addClass("pause");
			play();
		}
		else {
			button.removeClass("pause");
			button.addClass("play");
			pause();
		}

	});

	player = document.getElementById("player");

	// Запуск периодического обновления названия играющего трека
	var trackInfo = $("#current-track-info");
	trackInfo.load("php/icecast-current-track.php");
	setInterval(function () {
		trackInfo.load("php/icecast-current-track.php");
	}, 5 * 1000);
});
