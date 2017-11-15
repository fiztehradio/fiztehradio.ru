// Get Typekit fonts
try{Typekit.load({ async: true });}catch(e){}

// Stream control functions
var player = document.getElementById("player");

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

window.onload = function () {
    document.getElementById("play-button").onclick = function () {

        if (this.className === 'play') {
            this.className = 'pause';
            play();
        }
        else {
            this.className = 'play';
            pause();
        }
    }
};

// Ыcript to refresh the current Artist Track
$(document).ready(function () {
    setInterval(function () {
        $("#current-track-info").load("php/icecast-current-track.php");
    }, 5 * 1000);
});

