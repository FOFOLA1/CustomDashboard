const weather_setupwarn = document.getElementById("weather_setupwarn");
const weather = document.getElementById("weather");
const weatherSetup = document.getElementById("weatherSetup");

const weather_temp = document.getElementById("weather_temp");
const weather_icon = document.getElementById("weather_icon");
const weather_minmax = document.getElementById("weather_minmax");
const weather_humidity = document.getElementById("weather_humidity");
const weather_forecast = document.getElementById("weather_forecast");
const weatherReloadImg = document.getElementById("weatherReloadImg");
const weatherSpinner = document.getElementById("weatherSpinner");
const weatherSettings = document.getElementById("weatherSettings");

const weatherConfig_overlay = document.getElementById("weatherConfig_overlay");
const city_weatherConfig_overlay = document.getElementById("city_weatherConfig_overlay");
const apply_weatherConfig_overlay = document.getElementById("apply_weatherConfig_overlay");
const exit_weatherConfig_overlay = document.getElementById("exit_weatherConfig_overlay");
const weatherConfig_error = document.getElementById("weatherConfig_error");

const weatherscroll = document.getElementById("weatherscroll");

let loc = null;



class Location {
    constructor(city, lat, lon) {
        this.city = city;
        this.lat = lat;
        this.lon = lon;
    }
}


if (localStorage.getItem("location") == null) {
    weather_setupwarn.classList.remove("hidden");
} else {
    let temp = localStorage.getItem("location").split(",");
    loc = new Location(temp[0], temp[1], temp[2]);
    getWeather();
    weather.classList.remove("hidden");
}

weatherSetup.addEventListener("click", setupWeather);
apply_weatherConfig_overlay.addEventListener("click", ApplyConfig);


weatherscroll.addEventListener('wheel', function (e) {
    if (!e.deltaY) {
        return;
    }

    e.currentTarget.scrollLeft += (e.deltaY + e.deltaX)/3.5;
    e.preventDefault();
});

let isDown = false;
let startX;
let scrollLeft;


exit_weatherConfig_overlay.addEventListener("click", function(e) {
    hideOverlay();
    city_weatherConfig_overlay.value = "";
});

weatherReloadImg.addEventListener("click", function(e) {
    weatherReloadImg.style.display = "none";
    weatherSpinner.style.display = "block";
    getWeather().then(() => {
        weatherSpinner.style.display = "none";
        weatherReloadImg.style.display = "block";
    });
});

weatherSettings.addEventListener("click", function(e) {
    setupWeather();
    city_weatherConfig_overlay.value = loc.city;
})


function setupWeather() {
    showOverlay(weatherConfig_overlay);
}

function ApplyConfig() {
    let city = city_weatherConfig_overlay.value;
    if (city == "") return;
    fetch(`/api/getCity?city=${city}`,
        {method: "GET"}
    ).then((response) => {
        console.log(response);
        if (!response.ok) console.log("Something went wrong");
        return response.json();
    }).then((data) => {
        if (data.lat && data.lon) {
            loc = new Location(city, data.lat, data.lon);
            localStorage.setItem("location", `${city},${data.lat},${data.lon}`);

            getWeather();

            hideOverlay();
            city_weatherConfig_overlay.value = "";

            weather_setupwarn.classList.add("hidden");
            weather.classList.remove("hidden");
        } else {
            weatherConfig_error.innerHTML = "City not found";
        }
    });
}

async function getWeather() {
    return fetch(`/api/getWeather?lat=${loc.lat}&lon=${loc.lon}`,
        {method: "GET"}
    ).then((response) => {
        if(!response.ok) console.log("Something went wrong");
        return response.json();
    }).then((dat) => {
        weather_temp.innerHTML = Math.round(dat.current.main.temp) + "°";
        weather_icon.src = `https://openweathermap.org/img/wn/${dat.current.weather[0].icon}@2x.png`;
        weather_icon.alt = dat.current.weather[0].description;
        weather_icon.setAttribute("draggable", false);
        weather_minmax.innerHTML = Math.round(dat.current.main.temp_min) + "°/" + Math.round(dat.current.main.temp_max) + "°";
        weather_humidity.innerHTML = Math.round(dat.current.main.humidity) + "%";

        weather_forecast.innerHTML = "";
        dat.hourly.forEach(element => {
            let div = document.createElement("div");
            let h3_date = document.createElement("h3");
            let h3_time = document.createElement("h3");
            let time = element.dt_txt.split(" ");
            time[0] = time[0].split("-");
            time[1] = time[1].split(":");
            h3_date.innerHTML = `${parseInt(time[0][2])}/${parseInt(time[0][1])}`;
            h3_time.innerHTML = `${parseInt(time[1][0])}h`;
            let img = document.createElement("img");
            img.setAttribute("draggable", false);
            img.src = `https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`;
            img.alt = element.weather.map(item => item.description).join('\n');
            let h4_temp = document.createElement("h4");
            h4_temp.innerHTML = Math.round(element.main.temp) + "°";
            let h4_humidity = document.createElement("h4");
            h4_humidity.innerHTML = element.main.humidity + "%";

            div.appendChild(h3_date);
            div.appendChild(h3_time);
            div.appendChild(img);
            div.appendChild(h4_temp);
            div.appendChild(h4_humidity);

            weather_forecast.appendChild(div);
        });
    })
}
