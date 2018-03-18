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

function swapElementClasses(e, from, to) {
	e.removeClass(from);
	e.addClass(to);
}

var angle = 0;

function startPlanetRotation() {
	var planet = $('#mipt-planet');

	if (!planet.length) return;

	planet.css("animation-duration", "30s");
	planet.css("-webkit-animation-duration", "30s");
	planet.css("-moz-animation-duration", "30s");
	planet.css("-o-animation-duration", "30s");

	planet.css("animation-iteration-count", "infinite");
	planet.css("-webkit-animation-iteration-count", "infinite");
	planet.css("-moz-animation-iteration-count", "infinite");
	planet.css("-o-animation-iteration-count", "infinite");

	planet.css("animation-timing-function", "linear");
	planet.css("-webkit-animation-timing-function", "linear");
	planet.css("-mox-animation-timing-function", "linear");
	planet.css("-o-animation-timing-function", "linear");

	planet.css("animation-name", "rotation-" + Math.floor(angle));
}

function stopPlanetRotation() {
	var planet = $('#mipt-planet');

	if (!planet.length) return;

	angle = getCurrentRotationFixed("mipt-planet");

	planet.css("transform", "rotate(" + angle + "deg) translate(-50%, -50%)");
	planet.css("-webkit-transform", "rotate(" + angle + "deg) translate(-50%, -50%)");
	planet.css("-mox-transform", "rotate(" + angle + "deg) translate(-50%, -50%)");
	planet.css("-o-transform", "rotate(" + angle + "deg) translate(-50%, -50%)");

	planet.css("animation", "none");
	planet.css("-webkit-animation", "none");
	planet.css("-mox-animation", "none");
	planet.css("-o-animation", "none");
}

function updateUtcTime() {
	var currentTime = new Date().getTime();
	utcTime = moment(currentTime).utc().format("HH:mm:ss");
}

$(document).ready(function () {

	updateUtcTime();
	sunriseTime = "05:15:00";	//"5:15:00"
	sunsetTime = "13:15:00";	//"13:15:00"

	var planet = $('#mipt-planet');
	var button = $('#play-button');

	planet.css("animation-timing-function", "linear");
	planet.css("transform", "translate(-50%, -50%)")

	button.click(function () {

		if (button.hasClass("play")) {
			swapElementClasses(button, "play", "pause");
			startPlanetRotation();
			play();
		}
		else {
			swapElementClasses(button, "pause", "play");
			stopPlanetRotation();
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
	// schemeSwtich.val(false);

	schemeSwtich.change(function () {
		setColorScheme(this.checked ? "day" : "night");
	});
});

function setColorScheme(colorScheme) {

	if (colorScheme == "day") {
		$(".night-color-scheme").each(function () {
			$(this).removeClass("night-color-scheme");
			$(this).addClass("day-color-scheme");
			$("#circles-day").css("opacity", 1);
			$("#color-scheme-switch").attr('checked', true);
			$("#color-scheme-switch").val(true);
		});
	}
	else if (colorScheme == "night") {
		$(".day-color-scheme").each(function () {
			$(this).removeClass("day-color-scheme");
			$(this).addClass("night-color-scheme");
			$("#circles-day").css("opacity", 0);
			$("#color-scheme-switch").attr('checked', false);
			$("#color-scheme-switch").val(false);
		});
	}
}

var utcTime;
var sunriseTime; //"5:15:00"
var sunsetTime;	//"13:15:00"

function setColorSchemeByTime() {

	console.log("UTC: " + utcTime + ", sunrise: " + sunriseTime + ", sunset: " + sunsetTime);
	// $("#temp").html(utcTime +  " " + sunriseTime + " " + sunsetTime);

	var delta;

	if (utcTime > sunriseTime && utcTime < sunsetTime) {
		console.log("Switching to day color scheme");
		$("#temp").css("color", "blue");
		setColorScheme("day");

		delta = moment.utc(moment(sunsetTime, "HH:mm:ss").diff(moment(utcTime, "HH:mm:ss"))).format("HH:mm:ss");
	}
	else {
		console.log("Switching to night color scheme");
		$("#temp").css("color", "red");
		setColorScheme("night");

		delta = moment.utc(moment(sunriseTime, "HH:mm:ss").diff(moment(utcTime, "HH:mm:ss"))).format("HH:mm:ss");
	}

	var deltaSeconds = moment.duration(delta).as('seconds');
	console.log("Color scheme will automatically change in " + deltaSeconds + "s");
	setTimeout(function () {
		updateUtcTime();
		setColorSchemeByLocation();
	}, deltaSeconds * 1000);
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

	$.getJSON(link, function (data) {

		// sunriseTime = moment(data.results.sunrise, ["hh:mm:ss A"]).format("HH:mm:ss");
		// sunsetTime = moment(data.results.sunset, ["hh:mm:ss A"]).format("HH:mm:ss");

		setColorSchemeByTime();
	})
	// .error(function() { setColorSchemeByTime(); });
}


function getCurrentRotationFixed(elid) {
	var el = document.getElementById(elid);
	var st = window.getComputedStyle(el, null);
	var tr = st.getPropertyValue("-webkit-transform") ||
		st.getPropertyValue("-moz-transform") ||
		st.getPropertyValue("-ms-transform") ||
		st.getPropertyValue("-o-transform") ||
		st.getPropertyValue("transform") ||
		"fail...";

	if (tr !== "none") {
		// console.log('Matrix: ' + tr);

		var values = tr.split('(')[1];
		values = values.split(')')[0];
		values = values.split(',');
		var a = values[0];
		var b = values[1];
		var c = values[2];
		var d = values[3];

		var scale = Math.sqrt(a * a + b * b);

		// First option, don't check for negative result
		// Second, check for the negative result
		/** /
		 var radians = Math.atan2(b, a);
		 var angle = Math.round( radians * (180/Math.PI));
		 /*/
		var radians = Math.atan2(b, a);
		if (radians < 0) {
			radians += (2 * Math.PI);
		}
		return Math.round(radians * (180 / Math.PI));
		/**/

	} else {
		return 0;
	}
}
