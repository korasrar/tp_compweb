import { API_ENDPOINT } from "./config.js";
import { parseHash } from "./services/UrlParser.js";
import { PokeList } from "./views/PokeList.js";
import { PokeDetail } from "./views/PokeDetail.js";
import { PokeFavoris } from "./views/PokeFavoris.js";
import { Home } from "./views/Home.js";
import { PokeProvider } from "./services/PokeProvider.js";

const container = document.getElementById("container");

const pokeProvider = new PokeProvider(API_ENDPOINT);
const pokeList = new PokeList(pokeProvider, container);
const pokeDetail = new PokeDetail(pokeProvider, container);
const pokeFavoris = new PokeFavoris(pokeProvider, container);
const home = new Home(pokeProvider, container);
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

  let page = pokeDetail;
  content.innerHTML = await page.render(1);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
