// No game is initialized yet, do it all "naked"
var menuTheme = new Audio('assets/audio/music/menu_theme.mp3');
menuTheme.loop = true;
menuTheme.play();

function hideMenu() {
    document.getElementById('menu').remove();
    menuTheme.pause();
    menuTheme = false; // Let the GC handle it
}