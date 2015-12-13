var menu = (function () {
    // No game is initialized yet, do it all "naked"
    var menuTheme = new Audio('assets/audio/music/menu_theme.ogg')
    menuTheme.loop = true
    menuTheme.play()
    var muted = false
    var app

    function startGame() {
        var gameViewElem = document.getElementById('gameView')
        var tutorialElement = document.getElementById('help')

        if (tutorialElement.className === "hide") {
            tutorialElement.setAttribute('class', 'show')
        }

        while (gameViewElem.lastChild) {
            gameViewElem.removeChild(gameViewElem.lastChild)
        }

        menuTheme.pause()
        app = new App(muted)
    }

    function showTutorial() {
        var tutorialElement = document.getElementById('tutorialView')

        if (tutorialElement.className === "hide") {
            tutorialElement.setAttribute('class', 'show')
        } else {
            tutorialElement.setAttribute('class', 'hide')
        }
    }

    function toggleSound() {
        console.log('Toggle sound')

        if (muted = !muted) {
            document.getElementById("mute").style.display = "none"
            document.getElementById("unmute").style.display = "inline-block"

            menuTheme.pause()
        } else {
            document.getElementById("mute").style.display = "inline-block"
            document.getElementById("unmute").style.display = "none"

            !app && menuTheme.play()
        }

        app && app.sfx.toggle()
    }

    return {
        startGame: startGame,
        showTutorial: showTutorial,
        muteSound: toggleSound,
        unmuteSound: toggleSound
    }
})()
