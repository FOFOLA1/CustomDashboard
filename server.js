import express from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { writeFileSync, readFileSync } from "fs";
import https from "https";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const IP = "127.0.0.1";

const privateKey = readFileSync('server.key', 'utf8');
const certificate = readFileSync('server.cert', 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.static(join(__dirname, "public")));

// API endpoint
/*app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
	return res.status(400).json({ error: 'City is required' });
  }

  try {
	const apiKey = process.env.API_KEY;
	const response = await fetch(`https://api.example.com/weather?city=${city}&apikey=${apiKey}`);
	const data = await response.json();
	res.json(data);
  } catch (err) {
	res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});*/

const unsplash_secret = process.env.UNSPLASH_SECRET;
const unsplash_id = process.env.UNSPLASH_ID;
let old_imgs = JSON.parse(readFileSync('imgs.json', 'utf-8'));

let _dailyQuote = {
	q: null,
	a: null,
	day: null
};

const apiverve_key = process.env.APIVERVE_KEY;
let _joke = {setup: null, punchline: null};

const openweather_key = process.env.OPENWEATHER_KEY;

// Fallback: return index.html for root
app.get("/", (req, res) => {
	//res.sendFile(join(__dirname, "public", "index.html"));

	let bg_img = "";
	Promise.all([fetchBG(), fetchDaily(), getJoke()])
		.then(([bg_data, daily_data, joke_data]) => {
			const pageData = {
				bg_image: bg_data,
				daily_quote: daily_data.q, daily_author: daily_data.a,
				joke_setup: joke_data.setup, joke_punch: joke_data.punchline
			};

			res.render('index.ejs', pageData);
		});


		//res.render('index.ejs', { bg_image: old_imgs[5], daily_quote: "There are no contests in the Art of Peace. A true warrior is invincible because he or she contests with nothing.", daily_author: "Morihei Ueshiba" });
});


app.get("/api/favicon", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    try {
        const response = await fetch(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=64`, {
            method: "GET",
            redirect: "follow" // ensures we follow any redirects
        });

        if (!response.ok) {
            return res.status(500).json({ error: "Failed to fetch favicon from Google" });
        }

        // The final URL after redirects
        const finalUrl = response.url;

        res.json({ faviconUrl: finalUrl });
    } catch (error) {
        console.error("Error fetching favicon:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/joke", async (req, res) => {
	try{
		let joke_data = await getJoke();
		res.json({setup: joke_data.setup, punchline: joke_data.punchline});
	} catch (error) {
		console.error("Error fetching joke:", error);
        res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/api/getCity", async (req, res) => {
	const { city } = req.query;

	if (!city) {
        return res.status(400).json({ error: "Missing 'city' query parameter" });
    }

	try{
		let city_data = await getCity(city);
		res.json({lat: city_data.lat, lon: city_data.lon});
	} catch (error) {
		console.error("Error fetching city:", error);
        res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/api/getWeather", async (req, res) => {
	const { lat, lon } = req.query;

	if (!lat || !lon) {
        return res.status(400).json({ error: "Missing 'lat' or 'lon' query parameter" });
    }

	Promise.all([fetchCurrentWeather(lat, lon), fetchHourlyWeather(lat, lon)])
	.then(([current_data, hourly_data]) => {
		res.json({current: current_data, hourly: hourly_data});
	});
});


const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, IP, () => {
    console.log(`HTTPS Server running on https://${IP}:${PORT}`);
});

function save() {
    writeFileSync('imgs.json', JSON.stringify(old_imgs));
}


async function fetchBG() {
	return old_imgs[5];
	return fetch(`https://api.unsplash.com/photos/random?orientation=landscape`,
		{
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				'Accept-Version': 'v1',
				'Authorization': `Client-ID ${unsplash_id}`
			}
		}
	).then((response) => {
		if (!response.ok)
			throw new Error("Response from UnsplashAPI not ok");
		return response.json();
	})
	.then((result) => {
		old_imgs.push(result.urls.regular);
		save();
		return result.urls.regular;
	})
	.catch((err) => {
		console.log(err);
		return old_imgs[Math.floor(Math.random() * old_imgs.length)];
	});
}

async function fetchDaily() {
	if (_dailyQuote.day == new Date().getDay()) return _dailyQuote;
	return fetch("https://api.viewbits.com/v1/zenquotes?mode=today",
		{
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			}
		}
	).then((response) => {
		if (!response.ok)
			throw new Error("Response from ViewbitsAPI not ok");
		return response.json();
	})
	.then((result) => {
		_dailyQuote.day = new Date().getDay();
		_dailyQuote.q = result[0].q;
		_dailyQuote.a = result[0].a;
		return _dailyQuote;
	})
	.catch((err) => {
		console.log(err);
		return _dailyQuote;
	});
}

async function getJoke() {
	return fetch(`https://api.apiverve.com/v1/randomjoke`,
		{
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiverve_key
			}
		}
	).then((response) => {
		if (!response.ok)
			throw new Error("Response from Apiverve not ok");
		return response.json();
	})
	.then((result) => {
		_joke.setup = result.data.setup;
		_joke.punchline = result.data.punchline
		return _joke;
	})
	.catch((err) => {
		console.log(err);
		return _joke;
	})
}

async function getCity(city) {
	console.log(city);
	return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openweather_key}`,
		{
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			}
		}
	).then((response) => {
		if (!response.ok)
			throw new Error("Response from OpenWeather not ok");
		return response.json();
	}).then((result) => {
		let lat = result[0].lat;
		let lon = result[0].lon;
		return {lat, lon};
	})
	.catch((err) => {
		console.log(err);
		return;
	})
}

async function fetchCurrentWeather(lat, lon) {
	return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openweather_key}`,
		{
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			}
		}
	).then((response) => {
		if (!response.ok)
			throw new Error("Response from OpenWeather not ok");
		return response.json();
	}).then((data) => {
		return {weather: data.weather, main: data.main};
	})
	.catch((err) => {
		console.log(err);
		return;
	})
}

async function fetchHourlyWeather(lat, lon) {
	return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=48&appid=${openweather_key}`,
		{
			method: "GET",
			headers: {
				'Content-Type': 'application/json'
			}
		}
	).then((response) => {
		if (!response.ok)
			throw new Error("Response from OpenWeather not ok");
		return response.json();
	}).then((data) => {
		return data.list;
	})
	.catch((err) => {
		console.log(err);
		return;
	});
}