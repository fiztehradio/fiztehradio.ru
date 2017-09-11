const volumeDelta = 0.00001;

function play() {
    var player = document.getElementById("player");
    player.volume = 0;
    player.play();
    var volume;
    while (player.volume < 1)
    {
        volume = player.volume + volumeDelta;
        player.volume = volume > 1 ? 1 : volume;
    }
}

function pause() {
    var player = document.getElementById("player");
    var volume;
    while (player.volume > 0)
    {
        volume = player.volume - volumeDelta;
        player.volume = volume < 0 ? 0 : volume;
    }

    player.pause();
}

window.onload = function () {
    document.getElementById("play-button").onclick = function () {

        if (this.className === 'play') {
            this.className = 'pause';
            setTimeout(play, 300);
        }
        else {
            this.className = 'play';
            setTimeout(pause, 300);
        }
    }
};