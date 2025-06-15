const cursorHint = document.getElementById("cursorHint");
const cursorHintText = document.getElementById("cursorHintText");

let cursorHintTimeout;
let coordX = 0;
let coordY = 0;


document.addEventListener("mousemove", (event) => {
    coordX = event.clientX;
    coordY = event.clientY;
});

document.body.addEventListener('mouseover', (event) => {
    if (event.target.tagName.toLowerCase() == 'img') {
        timeoutId = setTimeout(showHint, 500, event.target.alt);
    }
});

document.body.addEventListener('mousemove', (event) => {
    hintMouseleave(event);
});






function hintMouseleave(event) {
    clearTimeout(cursorHintTimeout);
    cursorHintText.textContent = "";
    cursorHint.style.display = 'none';
}

function showHint(text) {
    if (text == "" || text == null) return;
    cursorHintText.textContent = text;
    cursorHint.style.display = 'block';
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