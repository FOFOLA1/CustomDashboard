const jokeSetup = document.getElementById("jokeSetup");
const jokePunch = document.getElementById("jokePunch");
const jokeReload = document.getElementById("jokeReload");
const jokeReloadImg = document.getElementById("jokeReloadImg");
const jokeSpinner = document.getElementById("jokeSpinner");

jokeReload.addEventListener("click", joke_reload);

function joke_reload() {
    jokeReloadImg.style.display = "none";
    jokeSpinner.style.display = "block";

    fetch('/api/joke',
        {method: "GET"}
    ).then((response) => {
        if (!response.ok) console.log("Something went wrong");
        return response.json();
    }).then((data) => {
        jokeSetup.textContent = data.setup;
        jokePunch.textContent = data.punchline;

        jokeSpinner.style.display = "none";
        jokeReloadImg.style.display = "block";
    });
}