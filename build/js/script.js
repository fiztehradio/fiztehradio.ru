function play(){player.volume=1,player.play(),yaCounter46493418.reachGoal("PLAY")}function pause(){player.pause(),yaCounter46493418.reachGoal("PAUSE")}try{Typekit.load({async:!0})}catch(a){}var player;window.onload=function(){var a=($("#mipt-planet"),$("#play-button"));a.click(function(){a.hasClass("play")?(a.removeClass("play"),a.addClass("pause"),document.getElementById("mipt-planet").style.animationPlayState="running",play()):(a.removeClass("pause"),a.addClass("play"),document.getElementById("mipt-planet").style.animationPlayState="paused",pause())})},$(document).ready(function(){player=document.getElementById("player");var a=$("#current-track-info");a.load("php/icecast-current-track.php"),setInterval(function(){a.load("php/icecast-current-track.php")},5e3);var e=$("#color-scheme-switch");e.val(!1),e.change(function(){this.checked?$(".night-color-scheme").each(function(){$(this).removeClass("night-color-scheme"),$(this).addClass("day-color-scheme"),$("#circles-day").css("opacity",1)}):$(".day-color-scheme").each(function(){$(this).removeClass("day-color-scheme"),$(this).addClass("night-color-scheme"),$("#circles-day").css("opacity",0)}),e.val(this.checked)})});