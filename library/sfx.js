var SFX = function (app, muted) {
    this.app = app
    this.muted = muted
    this.backgroundMusic
    this.audioClips = {}
}

SFX.prototype.preload = function () {
    this.backgroundMusic = new Audio('assets/audio/music/song.ogg')
    this.backgroundMusic.loop = true
    if(!this.muted){
        this.backgroundMusic.play()
    }

    this.audioClips.pickup = new Audio('assets/audio/effects/pickup.mp3')
    this.audioClips.planesound = new Audio('assets/audio/effects/planesound.mp3')
}

SFX.prototype.create = function () {
}

SFX.prototype.update = function () {
}

SFX.prototype.toggle = function () {
    this.muted = !this.muted

    if (!this.muted) {
        this.backgroundMusic.play()
    } else {
        this.backgroundMusic.pause()
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
    } else if (audioClips[name]) {
        this.audioClips[name].pause()
    }
}