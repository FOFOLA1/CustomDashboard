# Custom Home Page

Tento projekt představuje vlastní home page browseru jako webovou stránku, která získává různé informace a nástroje na jednom místě. Zahrnuje zobrazení aktuálního času a data, vyhledávací a "ask AI" panel, seznam oblíbených stránek, sekci s denním citátem, předpověď počasí, seznam úkolů (TODO) a sekci s náhodným vtipem a zprávami.

Projekt je postaven na technologiích Node.js s Express.js na straně serveru a čistého JavaScriptu, HTML (EJS šablony) a CSS (Tailwind CSS) na straně klienta.

Zde je podrobný rozpis jednotlivých částí:

### 1. Server-side (server.js)

Soubor `server.js` je srdcem backendu. Používá Express.js k obsluze HTTP požadavků a integraci s různými externími API.

*   **Použité moduly:**
    *   `express`: Webový framework pro Node.js.
    *   `node-fetch`: Pro provádění HTTP požadavků na externí API.
    *   `dotenv`: Pro načítání proměnných prostředí ze souboru `.env`.
    *   `cors`: Middleware pro povolení Cross-Origin Resource Sharing.
    *   `path`, `url`: Vestavěné moduly Node.js pro práci s cestami k souborům.
    *   `fs`: Vestavěný modul Node.js pro práci se souborovým systémem (používá se pro čtení SSL certifikátů a ukládání potřebných dat na disk).
    *   `https`: Vestavěný modul Node.js pro vytvoření HTTPS serveru.

*   **Konfigurace:**
    *   Načtení proměnné prostředí pomocí `dotenv.config()`.
    *   Definice portu a IP adresy pro server.
    *   Načtení SSL certifikátu a klíče pro spuštění HTTPS serveru.
    *   Nastevení EJS jako template engine na složku `views` .
    *   Nastevení složky `public` jako statickou složku pro obsluhu klientských souborů (CSS, JavaScript, obrázky atd.).
    *   Použití `cors()` jako middleware.

*   **API Endpoints:**
    *   `GET /`: Hlavní endpoint, který renderuje `index.ejs`. Před renderováním asynchronně načítá data z externích API (pozadí, denní citát, zprávy) a předává je do šablony.
    *   `GET /api/favicon`: Přijímá URL jako query parametr a vrací URL favicony pomocí Google Favicon API.
    *   `GET /api/joke`: Vrací náhodný vtip z Apiverve API.
    *   `GET /api/getCity`: Přijímá název města jako query parametr a vrací zeměpisnou šířku a délku města pomocí OpenWeatherMap Geocoding API.
    *   `GET /api/getWeather`: Přijímá zeměpisnou šířku a délku jako query parametry a vrací aktuální počasí a hodinovou předpověď z OpenWeatherMap API.
    *   `GET /api/getNews`: Vrací jednu zprávu z Newsdata.io API. Data zpráv jsou cachována po dobu 24 hodin.

*   **Pomocné funkce:**
    *   `save()`: Ukládá pole URL obrázků pozadí do souboru `imgs.json`.
    *   `fetchBG()`: Načítá náhodný obrázek pozadí z Unsplash API. V případě chyby vrací náhodný obrázek z lokálně uloženého seznamu (`imgs.json`).
    *   `fetchDaily()`: Načítá denní citát z Viewbits ZenQuotes API. Cachuje citát pro aktuální den.
    *   `getJoke()`: Načítá náhodný vtip z Apiverve API.
    *   `getCity(city)`: Načítá zeměpisné souřadnice pro dané město z OpenWeatherMap Geocoding API.
    *   `fetchCurrentWeather(lat, lon)`: Načítá aktuální data o počasí z OpenWeatherMap API.
    *   `fetchHourlyWeather(lat, lon)`: Načítá hodinovou předpověď počasí z OpenWeatherMap API.
    *   `getNews()`: Načítá zprávy z Newsdata.io API. Cachuje zprávy po dobu 24 hodin a vrací jednu po druhé.

*   **Spuštění serveru:**
    *   Server je spuštěn pomocí `https.createServer` na definované IP adrese a portu s použitím poskytnutých SSL certifikátů.

### 2. Client-side (public/*, views/index.ejs)

Klientská část se skládá z EJS šablony `index.ejs` a několika JavaScriptových souborů ve složce `public/script`.

*   **views/index.ejs:**
    *   Hlavní HTML struktura stránky.
    *   Používá EJS syntaxi (`<%= variable %>`) k vložení dat načtených serverem (obrázek pozadí, denní citát, zprávy).
    *   Definuje strukturu layoutu pomocí Tailwind CSS.
    *   Obsahuje sekce pro datum/čas, vyhledávací panely, oblíbené stránky, denní citát, počasí, TODO seznam, vtip a zprávy.
    *   Obsahuje HTML pro kontextové menu (`todoItemRCMenu`, `favPageRCMenu`) a hint pro obrázky (`cursorHint`).
    *   Obsahuje HTML pro překryvné vrstvy (overlays) pro přidání oblíbené stránky a konfiguraci počasí.
    *   Načítá všechny potřebné JavaScriptové soubory na konci těla dokumentu.

*   **public/script/time.js:**
    *   Nastavuje a aktualizuje zobrazení aktuálního času a data na stránce.
    *   Používá `setInterval` k aktualizaci času každých 5 sekund.

*   **public/script/bars.js:**
    *   Obsluhuje události klávesy 'Enter' na vyhledávacím panelu (`search_bar`) a panelu "ask AI" (`ask_bar`).
    *   Při stisku 'Enter' přesměruje uživatele na Brave Search nebo ChatGPT s dotazem zadaným v panelu.

*   **public/script/contextMenu.js:**
    *   Obsahuje pomocné funkce pro zobrazení a skrytí vlastních kontextových menu.
    *   `renderRCMenu(e, menu)`: Zobrazí dané kontextové menu na pozici kurzoru, přičemž zohlední okraje okna, aby menu nebylo oříznuto.
    *   `resetRCMenu()`: Skryje všechna vlastní kontextová menu.
    *   Zakazuje výchozí kontextové menu prohlížeče na celém dokumentu.

*   **public/script/fav_pages.js:**
    *   Spravuje seznam oblíbených stránek.
    *   Načítá seznam stránek z `localStorage`.
    *   `renderFavPages()`: Vykresluje seznam oblíbených stránek na stránce.
    *   `newFavPage(page)`: Vytvoří nový HTML element pro oblíbenou stránku, nastaví jeho href a src obrázku (favicony) a přidá event listenery pro kontextové menu.
    *   `AddFavPageCreate()`: Zpracovává přidání a edit oblíbené stránky. Načítá faviconu pomocí `/api/favicon` endpointu, ukládá stránku do `localStorage` a vykresluje ji.
    *   `FavPageEdit()`: Zobrazí overlay pro úpravu oblíbené stránky a nastaví `isEdit` na true. Samotná úprava dat probíhá v `AddFavPageCreate()`.
    *   `FavPageDelete()`: Smaže vybranou oblíbenou stránku ze seznamu a z `localStorage`.
    *   `getSelectedIndex()`: Pomocná funkce pro získání indexu vybrané oblíbené stránky v seznamu.
    *   Definuje třídu `FavPage` pro strukturování dat oblíbené stránky.

*   **public/script/img_hint.js:**
    *   Zobrazuje hint (nápovědu) s textem `alt` atributu obrázku, když uživatel najede myší na obrázek.
    *   Hint se zobrazí se zpožděním 500 ms a sleduje kurzor myši.
    *   Zohledňuje okraje okna, aby hint nebyl oříznut.

*   **public/script/joke.js:**
    *   Načítá a zobrazuje náhodný vtip.
    *   `joke_reload()`: Volá `/api/joke` endpoint, zobrazí spinner během načítání a po načtení zobrazí setup a punchline vtipu.

*   **public/script/news.js:**
    *   Načítá a zobrazuje zprávy.
    *   `news_reload()`: Volá `/api/getNews` endpoint, zobrazí spinner během načítání a po načtení aktualizuje odkaz, titulek a popis zprávy.

*   **public/script/overlay_util.js:**
    *   Obsahuje pomocné funkce pro zobrazení a skrytí překryvných vrstev (overlays).
    *   `showOverlay(div)`: Zobrazí hlavní overlay a daný div uvnitř něj. Zajišťuje, že se zobrazí pouze jeden overlay najednou.
    *   `hideOverlay()`: Skryje aktuálně zobrazený overlay a hlavní overlay.

*   **public/script/todo.js:**
    *   Spravuje seznam úkolů (TODO list).
    *   Načítá seznam úkolů z `localStorage`.
    *   `renderTodos()`: Vykresluje seznam úkolů na stránce.
    *   `newTodo(text)`: Vytvoří nový HTML element `<li>` pro úkol, nastaví jeho text a přidá posluchače událostí pro kontextové menu (pravé kliknutí) a smazání (dvojklik).
    *   `todoAdd(event)`: Zpracovává přidání nového úkolu při stisku 'Enter' v input poli. Přidá úkol do pole `todos`, vykreslí ho a uloží do `localStorage`.
    *   `todoDel(itemToDelete)`: Smaže daný úkol z pole `todos`, odstraní jeho HTML element a uloží aktualizovaný seznam do `localStorage`.
    *   `todoRclick(e)`: Obsluhuje pravé kliknutí na úkol, uloží referenci na element a zobrazí kontextové menu pro úkoly.
    *   `editTodo(itemToEdit)`: Nahradí text úkolu input polem pro úpravu.
    *   `saveEdit(inputElement, originalText)`: Uloží upravený text úkolu, aktualizuje pole `todos`, `localStorage` a nahradí input pole zpět `<li>` elementem.

*   **public/script/weather.js:**
    *   Spravuje zobrazení počasí.
    *   Načítá uloženou polohu z `localStorage`. Pokud není uložena, zobrazí varování a tlačítko pro nastavení.
    *   Definuje třídu `Location` pro strukturování dat o poloze.
    *   `setupWeather()`: Zobrazí overlay pro konfiguraci počasí.
    *   `ApplyConfig()`: Zpracovává nastavení města. Volá `/api/getCity` pro získání souřadnic, ukládá polohu do `localStorage` a volá `getWeather()`. V případě chyby zobrazí chybovou zprávu.
    *   `getWeather()`: Asynchronně volá `/api/getWeather` endpoint pro získání aktuálního počasí a hodinové předpovědi. Po načtení aktualizuje HTML elementy na stránce s daty o počasí.
    *   Obsluhuje události pro tlačítka nastavení a obnovení počasí (včetně zobrazení spinneru).
    *   Obsluhuje události kolečka myši pro horizontální scroll předpovědi počasí.

### 3. Styling (src/input.css)

Soubor `input.css` definuje styly pro stránku pomocí Tailwind CSS.

*   Importuje základní Tailwind styly.
*   Definuje vlastní font (`Kode Mono`).
*   Definuje vlastní barevné proměnné (`--color-dark`, `--color-ldark`).
*   Nastavuje výchozí font a zakazuje výběr textu (`select-none`) pro všechny prvky.
*   Definuje styly pro hlavní layout (`main`) pomocí gridu.
*   Definuje obecné styly pro sekce a kontejnery.
*   Definuje specifické styly pro TODO seznam, oblíbené stránky, kontextová menu, předpověď počasí a input pole pro úpravu úkolů.
*   Obsahuje styly pro skrytí scrollbaru (`scrollable`).

### 4. Požadavky na nastavení a spuštění

Pro spuštění projektu je potřeba:

1.  Nainstalovat Node.js a npm.
2.  Nainstalovat závislosti projektu (`npm install`).
3.  Vytvořit soubor `.env` v kořenovém adresáři projektu s následujícími proměnnými prostředí (klíče API je nutné získat od příslušných poskytovatelů):
    *   `UNSPLASH_SECRET`
    *   `UNSPLASH_ID`
    *   `APIVERVE_KEY2`
    *   `OPENWEATHER_KEY`
    *   `NEWSDATA_KEY`
4.  Vytvořit soubory `server.key` a `server.cert` pro HTTPS server.
5.  Spustit server (`node server.js`).
6.  Spustit proces pro kompilaci Tailwind CSS (např. pomocí `npx tailwindcss -i ./src/input.css -o ./public/output.css --watch`).