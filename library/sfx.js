var muted = false;
var backgroundMusic;
var audioClips = {};

function sfxPreload() {
    game.load.audio('music', 'assets/audio/music/song.ogg');
    game.load.audio('steps', 'assets/audio/effects/footsteps.ogg');
}

function sfxCreate() {
    backgroundMusic = game.add.audio('music', 0.3, true);
    audioClips = {
        'steps': game.add.audio('steps', 0.4)
    }

    audioClips['steps'].loop = true;

    playAudio('backgroundMusic');
}

function sfxUpdate() {
    if (
        player.body.velocity.y != 0
        || player.body.velocity.x != 0
    ) {
        playAudio('steps');
    } else {
        pauseAudio('steps');
    }
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
    } else if (audioClips[name] && !audioClips[name].isPlaying) {
        audioClips[name].play();
    }
}

function pauseAudio(name) {
    if (name == 'backgroundMusic') {
        backgroundMusic.pause();
    } else if (audioClips[name]) {
        audioClips[name].pause();
    }
}