const add_page = document.getElementById("add_page");
const saved_pages = document.getElementById("saved_pages");

const exit_FavPage_overlay = document.getElementById("exit_FavPage_overlay");
const add_FavPage_name = document.getElementById("add_FavPage_name");
const add_FavPage_url = document.getElementById("add_FavPage_url");
const add_FavPage_create = document.getElementById("add_FavPage_create");
const favPageRCMenu = document.getElementById("favPageRCMenu");
const favPageRCMenuItems = favPageRCMenu.querySelectorAll('li');
const favPageRCMenuEdit = favPageRCMenuItems[0];
const favPageRCMenuDelete = favPageRCMenuItems[1];
let selectedFavPage = null;
let isEdit = false;


let page_list = JSON.parse(localStorage.getItem('favPages')) || [];


renderFavPages();






add_page.addEventListener("click", () => {
    add_FavPage_create.innerHTML = "Create";
    showOverlay(add_FavPage_overlay)
});

exit_FavPage_overlay.addEventListener("click", function(e) {
    isEdit = false;
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
            if (isEdit) {
                let index = getSelectedIndex();
                if (index != -1) {
                    let page = new FavPage(name, url, data.faviconUrl);
                    page_list[index] = page;
                    renderFavPages();
                    localStorage.setItem("favPages", JSON.stringify(page_list));
                }
            } else {
                let page = new FavPage(name, url, data.faviconUrl);
                page_list.push(page);
                newFavPage(page);
                localStorage.setItem("favPages", JSON.stringify(page_list));
            }
        }
    });

    hideOverlay();
    isEdit = false;
    add_FavPage_name.value = "";
    add_FavPage_url.value = "";
}

function FavPageEdit() {
    add_FavPage_create.innerHTML = "Save";
    isEdit = true;
    showOverlay(add_FavPage_overlay);
    add_FavPage_url.value = selectedFavPage.parentElement.href;
    add_FavPage_name.value = selectedFavPage.alt;


    resetRCMenu();
}

function FavPageDelete() {
    let index = getSelectedIndex();
    if (index != -1) {
        saved_pages.removeChild(aElement);
        page_list.splice(index, 1);
        localStorage.setItem("favPages", JSON.stringify(page_list));
    }


    resetRCMenu();
}

function getSelectedIndex() {
    if (!selectedFavPage) return -1;

    let aElement = selectedFavPage.closest("a");
    if (!aElement) return -1;
    
    return Array.from(saved_pages.children).slice(0, -1).indexOf(aElement);
}



class FavPage {
    constructor(name, link, icon_link) {
        this.name = name;
        this.link = link;
        this.icon_link = icon_link;
    }
}