const search_bar = document.getElementById("search_bar");
const ask_bar = document.getElementById("ask_bar");

search_bar.addEventListener('keydown', search);
ask_bar.addEventListener("keydown", ask);


function search(event) {
    if (event.key === 'Enter') {
        const query = encodeURIComponent(search_bar.value.trim());
        if (query) {
            const url = `https://search.brave.com/search?q=${query}&source=desktop`;
            window.location.href = url;
        }
    }
}

function ask(event) {
    if (event.key === 'Enter') {
        const query = encodeURIComponent(ask_bar.value.trim());
        if (query) {
            const url = `https://chatgpt.com/?q=${query}`;
            window.location.href = url;
        }
    }
}