const newsReload = document.getElementById("newsReload");
const newsSpinner = document.getElementById("newsSpinner");
const newsReloadImg = document.getElementById("newsReloadImg");

const newsLink = document.getElementById("newsLink");
const newsTitle = document.getElementById("newsTitle");
const newsDescription = document.getElementById("newsDescription");

newsReload.addEventListener("click", news_reload);

function news_reload() {
    newsReloadImg.style.display = "none";
    newsSpinner.style.display = "block";

    fetch('/api/getNews',
        {method: "GET"}
    ).then((response) => {
        if (!response.ok) console.log("Something went wrong");
        return response.json();
    }).then((data) => {
        newsLink.href = data.link;
        newsTitle.textContent = data.title;
        newsDescription.textContent = data.description;

        newsSpinner.style.display = "none";
        newsReloadImg.style.display = "block";
    });
}