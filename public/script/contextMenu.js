


document.addEventListener('click', resetRCMenu);
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});



function renderRCMenu(e, menu) {
    resetRCMenu();
    e.preventDefault();

    // Temporarily show the menu to get dimensions
    menu.style.display = 'block';
    menu.style.visibility = 'hidden'; // Prevent flicker

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;

    let posX = e.pageX;
    let posY = e.pageY;

    // Adjust if going off right edge
    if (posX + menuWidth + 3 > pageWidth) {
        posX = pageWidth - menuWidth - 3;
    }

    // Adjust if going off bottom edge
    if (posY + menuHeight + 3 > pageHeight) {
        posY = pageHeight - menuHeight - 3;
    }

    // Apply final position
    menu.style.left = `${posX}px`;
    menu.style.top = `${posY}px`;

    menu.style.visibility = 'visible'; // Restore visibility
}


function resetRCMenu() {
    customRCMenu.style.display = 'none';
    todoItemRCMenu.style.display = "none";
    favPageRCMenu.style.display = "none";
}