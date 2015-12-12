var menu = (function(){
    // No game is initialized yet, do it all "naked"
    var menuTheme = new Audio('assets/audio/music/captain.mp3')
    menuTheme.loop = true
    menuTheme.play()
    var muted = false
    var app

// Tutorial stuff
    var tutorialSlide = -1
    var tutorialText = [
        "Your goal is to acquire the treasue scattered across the maze. Find enough of it and you win. However...",
        "While you are out and about hunting for the treasure, there are strange creatures roaming the labyrinth as well.",
        "If you are not careful, they steal all your treasure before you can collect it.",
        "If these visitors have stolen some of the treasure, you can catch them and take it off them.",
        "As these creatures are fearfull, they band together. A group is more dangerous than individuals.",
        "Rumors speak of a dangerous foe, who wanders the labyrinth and poses a threat to all that meet him."
    ]

    function removeMenu() {
        document.getElementById('menu').remove()
        menuTheme.pause()
        menuTheme = false // Let the GC handle it
    }

    function startGame(){
        var gameViewElem    = document.getElementById('gameView')
        var tutorialElement = document.getElementById('help')

        if (tutorialElement.className === "hide") {
            tutorialElement.setAttribute('class', 'show')
        }

        while(gameViewElem.lastChild){
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

    function nextSlide() {
        if (tutorialSlide < tutorialText.length - 1) {
            tutorialSlide++
        }
        document.getElementById('tutorialText').innerHTML = tutorialText[tutorialSlide]
    }

    function previousSlide() {
        if (tutorialSlide > 0) {
            tutorialSlide--
        }
        document.getElementById('tutorialText').innerHTML = tutorialText[tutorialSlide]
    }

    function toggleSound(){
        console.log('Toggle sound')

        if(muted = !muted){
            document.getElementById("mute").style.display = "none"
            document.getElementById("unmute").style.display = "inline-block"

            menuTheme.pause()
        }else{
            document.getElementById("mute").style.display = "inline-block"
            document.getElementById("unmute").style.display = "none"

            !app && menuTheme.play()
        }

        app && app.sfx.toggle()
    }

    return {
        startGame : startGame,
        showTutorial : showTutorial,
        muteSound: toggleSound,
        unmuteSound: toggleSound
    }
})()
