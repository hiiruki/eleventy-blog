document.documentElement.dataset.theme = localStorage.getItem('currentTheme') || 'dark';

document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    var i;
    for (i = 0; i < links.length; i++) {
        if (location.hostname !== links[i].hostname) {
            links[i].rel = "external nofollow noopener noreferrer";
            links[i].target = "_blank";
        }
    }
});