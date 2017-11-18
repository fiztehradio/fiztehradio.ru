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

	var currentTime = new Date().getTime();
	localTime = moment(currentTime).utc().format("HH:mm:ss");

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

	player = document.getElementById("player");

	// Запуск периодического обновления названия играющего трека
	var trackInfo = $("#current-track-info");
	trackInfo.load("php/icecast-current-track.php");
	setInterval(function () {
		trackInfo.load("php/icecast-current-track.php");
	}, 5 * 1000);


	// Определение местоположения
	setColorSchemeByLocation();

	// Запуск изменения цветовой схемы по изменению тумблера
	var schemeSwtich = $("#color-scheme-switch");
	schemeSwtich.val(false);

	schemeSwtich.change(function () {
		setColorScheme(this.checked ? "day" : "night");
		schemeSwtich.val(this.checked);
	});

});

function setColorScheme(colorScheme) {

	if (colorScheme == "day") {
		$(".night-color-scheme").each(function () {
			$(this).removeClass("night-color-scheme");
			$(this).addClass("day-color-scheme");
			$("#circles-day").css("opacity", 1);

		});
	}
	else if (colorScheme == "night") {
		$(".day-color-scheme").each(function () {
			$(this).removeClass("day-color-scheme");
			$(this).addClass("night-color-scheme");
			$("#circles-day").css("opacity", 0);
		});
	}
}

var localTime = "00:00:00";
var sunriseTime = "13:15:00";
var sunsetTime = "5:15:00";

function setColorSchemeByTime() {

	// $("#temp").html(localTime +  " " + sunriseTime + " " + sunsetTime);

	if (localTime > sunriseTime && localTime < sunsetTime)
	{
		$("#temp").css("color", "blue");
		setColorScheme("day");
	}
	else
	{
		$("#temp").css("color", "red");
		setColorScheme("night");
	}

}

function setColorSchemeByLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(positionReceived, setColorSchemeByTime);
	} else {
		setColorSchemeByTime();
	}
}

function positionReceived(position) {

	var link = "https://api.sunrise-sunset.org/json?lat=" + position.coords.latitude +
		"&lng=" + position.coords.longitude;

	$.getJSON( link, function( data ) {

		sunriseTime = moment(data.results.sunrise, ["hh:mm:ss A"]).format("HH:mm:ss");
		sunsetTime = moment(data.results.sunset, ["hh:mm:ss A"]).format("HH:mm:ss");

		setColorSchemeByTime();
	})
		.error(function() { setColorSchemeByTime(); });
}