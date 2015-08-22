var muted = false;
var backgroundMusic;
var audioClips = {};

function sfxPreload() {
    game.load.audio('music', 'assets/audio/music/song.ogg');
}

function sfxCreate() {
    backgroundMusic = game.add.audio('music', 0.3, true);
    // audioClips = {
    //     'hit' : game.add.audio('hit', 0.1),
    //     'death' : game.add.audio('death'),
    //     'convert' : game.add.audio('convert')
    // }
}

function sfxUpdate() {

}

function muteSound() {
    muted = !muted;
    
    if (!muted) {
        document.getElementById("mute").style.display = "inline-block";
        document.getElementById("unmute").style.display = "none";
        backgroundMusic.play();
    } else {
        document.getElementById("mute").style.display = "none";
        document.getElementById("unmute").style.display = "inline-block";
        backgroundMusic.pause();
    }
}

function playAudio(name) {
    if (muted) {
        return;
    }

    if (name == 'backgroundMusic') {
        backgroundMusic.play();
    } else if (audioClips[name]) {
        audioClips[name].play();
    }
}