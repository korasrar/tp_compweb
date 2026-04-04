import { LikeService } from '../services/LikeService.js';

export class PokeList {
  constructor(pokeProvider, container) {
    this.pokeProvider = pokeProvider;
    this.container = container;

    window.addEventListener('scroll', () => {
      const nav = document.getElementById('pagination-nav');
      if (nav) {
        if ((window.innerHeight + Math.round(window.scrollY)) >= document.documentElement.scrollHeight - 10) {
          nav.style.opacity = '0';
          nav.style.visibility = 'hidden';
          nav.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
        } else {
          nav.style.opacity = '1';
          nav.style.visibility = 'visible';
        }
      }
    });
  }

  async render(id, page){
    try {
      let currentPage = parseInt(page);
      if (currentPage < 1) currentPage = 1;
      
      localStorage.setItem('currentPage', currentPage);

      //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
      const [request, notesResponse] = await Promise.all([
        this.pokeProvider.fetchPokemons(currentPage),
        this.pokeProvider.fetchPokesNotes(),
      ]);

      const pokemons = request["results"];
      const hasPrevious = request["previous"]; 
      const hasNext = request["next"]; 

      const totalCount = request["count"];
      const limit = this.pokeProvider.limit;
      const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : currentPage; // fallback si count absent

      const maxButtons = 10;
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = startPage + maxButtons - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      let pagesButtonsHtml = "";
      for (let p = startPage; p <= endPage; p++) {
        pagesButtonsHtml += `
          <li class="page-item ${p === currentPage ? "active" : ""}">
            <a class="page-link" href="#/list/${p}">${p}</a>
          </li>
        `;
      }

      const notesArray = Array.isArray(notesResponse) ? notesResponse : (notesResponse && notesResponse.notes ? notesResponse.notes : []);
      const notesById = {};
      for (const n of notesArray) {
        notesById[n.pokeId] = n.note;
      }

      let html = `<div class="container mt-4">
                    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">`;

      for (const poke of pokemons) {
        const pokeId = this.getPokeId(poke.url);
        const poke_note = notesById[pokeId] ?? "?";
        const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`;

        html += ` 
          <div class="col">
            <div class="card h-100 shadow-sm text-center">
              <div class="card-body d-flex flex-column align-items-center justify-content-center">
                <a href="#/detail/${pokeId}" class="text-decoration-none">
                  <img src="${sprite}" alt="${poke.name} front" class="img-fluid mb-3" style="max-width: 96px;" loading="lazy">
                  <h5 class="card-title text-capitalize mb-3 text-dark">${poke.name}</h5>
                </a>
                <span class="badge bg-primary fs-6">Note : ${poke_note}/20</span>
                <div class="mt-2">
                  ${LikeService.getLikeButtonHTML(pokeId, poke.name)}
                </div>
              </div>
            </div>
          </div>
        `;
      }
    
      html += `   </div>
                  <nav id="pagination-nav" aria-label="Navigation Pokémon" class="mt-4 fixed-bottom">
                    <ul class="pagination justify-content-center">
                      ${hasPrevious
                        ? `<li class="page-item"><a class="page-link" href="#/list/${currentPage - 1}">Précédent</a></li>`
                        : `<li class="page-item disabled"><span class="page-link">Précédent</span></li>`}

                      ${pagesButtonsHtml}

                      ${hasNext
                        ? `<li class="page-item"><a class="page-link" href="#/list/${currentPage + 1}">Suivant</a></li>`
                        : `<li class="page-item disabled"><span class="page-link">Suivant</span></li>`}
                    </ul>
                  </nav>
                </div>
              </div>`;
                
      return html;

    } catch (error) {
      console.error("Error details:", error);
      return `
        <div class="container mt-4">
          <div class="alert alert-danger">
            <h4>Erreur</h4>
            <p>Impossible de charger les Pokémon: ${error.message}</p>
          </div>
        </div>
      `;
    }
  }

  insertNotePoke(pokeId, note) {
    
    const data = fs.readFileSync('data.json');
    const jsonData = JSON.parse(data)

    jsonData.notes.push({
      "pokeId": pokeId,
      "note": note
    })
    
  }

  getPokeId(url){
    const pokeId = url.split("/").filter((x) => x).pop();
    return pokeId;
  }
}
