var SFX = function (app, muted) {
    this.app = app
    this.muted = muted
    this.backgroundMusic
    this.audioClips = {}
}

SFX.prototype.preload = function () {
    this.backgroundMusic = new Audio('assets/audio/music/song.ogg')
    this.backgroundMusic.loop = true
    if (!this.muted) {
        this.backgroundMusic.play()
    }

    this.audioClips.pickup = new Audio('assets/audio/effects/pickup.ogg')
    this.audioClips.planesound = new Audio('assets/audio/effects/planesound.mp3')
}

SFX.prototype.create = function () {
}

SFX.prototype.update = function () {
}

SFX.prototype.toggle = function () {

    if (this.muted = !this.muted) {

        this.backgroundMusic.pause()

        for (var clip in this.audioClips) {
            this.pause(clip)
        }

    } else {

        this.backgroundMusic.play()

    }
}

SFX.prototype.play = function (name) {
    if (this.muted) {
        return
    }

    if (name == 'backgroundMusic') {
        this.backgroundMusic.play()
    } else if (this.audioClips[name] && !this.audioClips[name].isPlaying) {
        this.audioClips[name].play()
    }
}

SFX.prototype.pause = function (name) {
    if (name == 'backgroundMusic') {
        this.backgroundMusic.pause()
    } else if (this.audioClips[name]) {
        this.audioClips[name].pause()
    }
}