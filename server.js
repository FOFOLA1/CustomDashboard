import express from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { writeFileSync, readFileSync } from "fs";
import { error } from "console";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const IP = "127.0.0.1";

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
const unsplash_api = "https://api.unsplash.com";
let old_imgs = JSON.parse(readFileSync('imgs.json', 'utf-8'));

// Fallback: return index.html for root
app.get("/", (req, res) => {
	//res.sendFile(join(__dirname, "public", "index.html"));

	let bg_img = "";
	/*fetch(`${unsplash_api}/photos/random?orientation=landscape`,
	{
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Accept-Version': 'v1',
			'Authorization': `Client-ID ${unsplash_id}`
		}
	})
		.then((response) => {
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
		})
		.then((out) => {
			res.render('index.ejs', { bg_image: out });
		});*/
	
		res.render('index.ejs', { bg_image: old_imgs[5] });
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



app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

function save() {
    writeFileSync('imgs.json', JSON.stringify(old_imgs));
}
