let bg = document.getElementById("body");
fetch('/api/random_bg', {method: "GET"})
    .then((response) => response.json())
    .then((data) => {
        let url = data.url;
        bg.style.backgroundImage = `radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%), url('${url}')`;
    })
//let url = "https://images.unsplash.com/photo-1746121813274-50f7f8d4bad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTA4MjN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDcxNTg1NjB8&ixlib=rb-4.1.0&q=80&w=1080";


