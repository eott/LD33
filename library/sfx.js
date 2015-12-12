var sfx = (function () {
    var app;
    var muted = false;
    var backgroundMusic;
    var audioClips = {};

    function load(app) {
        this.app = app;
        this.app.game.load.audio('music', 'assets/audio/music/song.ogg');
        this.app.game.load.audio('steps', 'assets/audio/effects/footsteps.ogg');
        this.app.game.load.audio('pickup', 'assets/audio/effects/pickup.ogg');
    }

    function init() {
        backgroundMusic = app.game.add.audio('music', 0.3, true);
        audioClips = {
            'steps' : app.game.add.audio('steps', 0.4),
            'pickup': app.game.add.audio('pickup', 0.1)
        }

        audioClips['steps'].loop = true;

        play('backgroundMusic');
    }

    function update() {
        if (
            app.player.body.velocity.y != 0
                || app.player.body.velocity.x != 0
            ) {
            play('steps');
        } else {
            pause('steps');
        }
    }

    function mute() {
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

    function play(name) {
        if (muted) {
            return;
        }

        if (name == 'backgroundMusic') {
            backgroundMusic.play();
        } else if (audioClips[name] && !audioClips[name].isPlaying) {
            audioClips[name].play();
        }
    }

    function pause(name) {
        if (name == 'backgroundMusic') {
            backgroundMusic.pause();
        } else if (audioClips[name]) {
            audioClips[name].pause();
        }
    }


    return {
        load  : load,
        init  : init,
        update: update,
        mute  : mute,
        play  : play,
        pause : pause
    };

})();