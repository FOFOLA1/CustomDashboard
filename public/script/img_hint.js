const cursorHint = document.getElementById("cursorHint");
const cursorHintText = document.getElementById("cursorHintText");

let cursorHintTimeout;
let coordX = 0;
let coordY = 0;


document.addEventListener("mousemove", (event) => {
    coordX = event.clientX;
    coordY = event.clientY;
});

document.body.addEventListener('mouseover', function(event) {
    if (event.target.tagName.toLowerCase() === 'img') {
        hintMouseover(event);
    }
});

document.body.addEventListener('mouseout', function(event) {
    if (event.target.tagName.toLowerCase() === 'img') {
        hintMouseleave(event);
    }
});







function hintMouseover(event) {
    timeoutId = setTimeout(showHint, 500, event.target.alt);
}

function hintMouseleave(event) {
    clearTimeout(cursorHintTimeout);
    cursorHintText.textContent = "";
    cursorHint.style.display = 'none';
}

function showHint(text) {
    cursorHint.style.display = 'block';
    cursorHintText.textContent = text;
    const hintWidth = cursorHint.offsetWidth;
    const hintHeight = cursorHint.offsetHeight;

    let left = coordX + 20;
    let top = coordY + 20;

    if (left + hintWidth + 10 > window.innerWidth) {
        left = window.innerWidth - hintWidth - 10;
    }

    if (top + hintHeight + 10 > window.innerHeight) {
        top = window.innerHeight - hintHeight - 10;
    }
    cursorHint.style.left = left + 'px';
    cursorHint.style.top = top + 'px';
}