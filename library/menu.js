var menu = (function(app){
    // No game is initialized yet, do it all "naked"
    var menuTheme = new Audio('assets/audio/music/captain.mp3');
    menuTheme.loop = true;
    menuTheme.play();

// Tutorial stuff
    var tutorialSlide = -1;
    var tutorialText = [
        "Your goal is to acquire the treasue scattered across the maze. Find enough of it and you win. However...",
        "While you are out and about hunting for the treasure, there are strange creatures roaming the labyrinth as well.",
        "If you are not careful, they steal all your treasure before you can collect it.",
        "If these visitors have stolen some of the treasure, you can catch them and take it off them.",
        "As these creatures are fearfull, they band together. A group is more dangerous than individuals.",
        "Rumors speak of a dangerous foe, who wanders the labyrinth and poses a threat to all that meet him."
    ];

    function hideMenu() {
        document.getElementById('menu').remove();
        menuTheme.pause();
        menuTheme = false; // Let the GC handle it
    }

    function startGame(){

    }

    function showTutorial() {
        levelName = "Tutorial";
        hideMenu();
        initGame();
        document.getElementById('tutorialMenu').setAttribute('style', 'display: block;');
        nextSlide();
    }

    function nextSlide() {
        if (tutorialSlide < tutorialText.length - 1) {
            tutorialSlide++;
        }
        document.getElementById('tutorialText').innerHTML = tutorialText[tutorialSlide];
    }

    function previousSlide() {
        if (tutorialSlide > 0) {
            tutorialSlide--;
        }
        document.getElementById('tutorialText').innerHTML = tutorialText[tutorialSlide];
    }

    function evilStuff() {
        somethingSinister("Mode: ULTRA-EVIL, Countdown: 5 seconds");
        worldDestroyed = true;
    }

    function somethingSinister() {
        // TODO: Implement doomsday device
    }

    function muteSound(){

    }

    function unmuteSound(){

    }

    return this;
})(app);