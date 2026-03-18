import { API_ENDPOINT } from "./config.js";
import { parseHash } from "./services/UrlParser.js";
import { PokeList } from "./views/PokeList.js";
import { PokeDetail } from "./views/PokeDetail.js";
import { PokeFavoris } from "./views/PokeFavoris.js";
import { Home } from "./views/Home.js";
import { Error404 } from "./views/Error404.js";
import { PokeProvider } from "./services/PokeProvider.js";

const pokeProvider = new PokeProvider(API_ENDPOINT);
const pokeList = new PokeList(pokeProvider);
const pokeDetail = new PokeDetail(pokeProvider);
const pokeFavoris = new PokeFavoris(pokeProvider);
const home = new Home(pokeProvider);
const error404 = new Error404(pokeProvider);

const routes = {
    "/": home,
    "/list/:page": pokeList,
    "/list/:page/:id": pokeDetail,
    "/favorites": pokeFavoris,
};

async function router() {
    const content = null || document.getElementById("container");

    let request = parseHash();
    let parsedURL =
        (request.resource ? "/" + request.resource : "/") +
        (request.page ? "/:page" : "") +
        (request.id ? "/:id" : "");
        
    let page = routes[parsedURL] ? routes[parsedURL] : error404;
    content.innerHTML = await page.render();
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
