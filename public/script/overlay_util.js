const overlay = document.getElementById("overlay");

let current = null;

function showOverlay(div) {
    if (current != null) return false;
    overlay.style.display = "flex";
    current = div;
    div.style.display = "flex";
    return true;
}

function hideOverlay() {
    current.style.display = "none";
    current = null;
    overlay.style.display = "none";
}

