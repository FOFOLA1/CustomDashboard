const add_page = document.getElementById("add_page");
const saved_pages = document.getElementById("saved_pages");

const exit_FavPage_overlay = document.getElementById("exit_FavPage_overlay");
const add_FavPage_name = document.getElementById("add_FavPage_name");
const add_FavPage_url = document.getElementById("add_FavPage_url");
const add_FavPage_create = document.getElementById("add_FavPage_create");
const cursorHint = document.getElementById("cursorHint");
const cursorHintText = document.getElementById("cursorHintText");
const favPageRCMenu =  document.getElementById("favPageRCMenu");
const favPageRCMenuItems = favPageRCMenu.querySelectorAll('li');
const favPageRCMenuEdit = favPageRCMenuItems[0];
const favPageRCMenuDelete = favPageRCMenuItems[1];
let selectedFavPage = null;
let cursorHintTimeout;
let coordX = 0;
let coordY = 0;

let page_list = JSON.parse(localStorage.getItem('favPages')) || [];


renderFavPages();




document.addEventListener("mousemove", (event) => {
    coordX = event.clientX;
    coordY = event.clientY;
});

add_page.addEventListener("click", () => showOverlay(add_FavPage_overlay));

exit_FavPage_overlay.addEventListener("click", function(e) {
    hideOverlay();
    add_FavPage_name.value = "";
    add_FavPage_url.value = "";
});

add_FavPage_create.addEventListener("click", AddFavPageCreate);

favPageRCMenuEdit.addEventListener("click", FavPageEdit);
favPageRCMenuDelete.addEventListener("click", FavPageDelete);

function renderFavPages() {
    while (saved_pages.children.length > 1) {
        saved_pages.removeChild(saved_pages.firstElementChild);
    }
    for (let page of page_list) {
        newFavPage(page);
    }
}

function newFavPage(page) {
    let a = document.createElement("a");
    a.href = page.link;
    let img = document.createElement("img");
    img.src = page.icon_link;
    img.alt = page.name;
    a.appendChild(img);
    img.addEventListener("mouseover", FavPageMouseover);
    img.addEventListener("mouseleave", FavPageMouseleave);
    a.addEventListener("contextmenu", (e) => {
        selectedFavPage = e.target
        renderRCMenu(e, favPageRCMenu);
    });
    saved_pages.insertBefore(a, saved_pages.children[saved_pages.children.length-1]);
}

function AddFavPageCreate() {
    let url = add_FavPage_url.value;
    let name = add_FavPage_name.value;
    fetch(`/api/favicon?url=${encodeURIComponent(url)}`)
    .then(res => res.json())
    .then(data => {
        if (data.faviconUrl) {
            let page = new FavPage(name, url, data.faviconUrl);
            page_list.push(page);
            newFavPage(page);
            localStorage.setItem("favPages", JSON.stringify(page_list));
        }
    });

    hideOverlay();
    add_FavPage_name.value = "";
    add_FavPage_url.value = "";
}

function FavPageMouseover(event) {
    timeoutId = setTimeout(showHint, 500, event.target.alt);
}

function FavPageMouseleave(event) {
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

function FavPageEdit() {



    resetRCMenu();
}

function FavPageDelete() {
    if (!selectedFavPage) return;

    let aElement = selectedFavPage.closest("a");
    if (!aElement) return;

    let children = Array.from(saved_pages.children).slice(0, -1);
    let index = children.indexOf(aElement);

    if (index != -1) {
        saved_pages.removeChild(aElement);
        page_list.splice(index, 1);
        localStorage.setItem("favPages", JSON.stringify(page_list));
    }


    resetRCMenu();
}



class FavPage {
    constructor(name, link, icon_link) {
        this.name = name;
        this.link = link;
        this.icon_link = icon_link;
    }
}