var SFX = function (app) {
    this.app = app
    this.muted = false
    this.backgroundMusic
    this.audioClips = {}
}

SFX.prototype.preload = function () {
}

SFX.prototype.create = function () {
}

SFX.prototype.update = function () {
}

SFX.prototype.mute = function () {
    this.muted = !this.muted

    if (!this.muted) {
        document.getElementById("mute").style.display = "inline-block"
        document.getElementById("unmute").style.display = "none"
        this.backgroundMusic.play()
    } else {
        document.getElementById("mute").style.display = "none"
        document.getElementById("unmute").style.display = "inline-block"
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