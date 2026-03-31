import { LikeService } from '../services/LikeService.js';

export class PokeDetail {
  constructor(pokeProvider, container) {
    this.pokeProvider = pokeProvider;
    this.container = container;
  }

  async render(id) {
    try {
      const pokemon = await this.pokeProvider.fetchPokemon(id);

      const pokemonLike = LikeService.isLiked(pokemon.id);
      console.log(`Pokémon ${pokemon.name} is ${pokemonLike ? 'liked' : 'not liked'}`);

      const speciesData = await this.pokeProvider.fetchSpeciesPokemon(pokemon);

      const evolutionData =
        await this.pokeProvider.fetchEvolutionChain(speciesData);

      // https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/14.png
      const typesIcons = pokemon.types
        .map((type) => {
          const typeId = type.type.url
            .split("/")
            .filter((x) => x)
            .pop();
          console.log(typeId);
          return `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeId}.png" alt="${typeId}" class="img-fluid p-1" style="max-width: 150px;" loading="lazy">`;
        })
        .join("");

      return `
        <div class="container mt-4 mb-4 border rounded p-3 bg-light">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <div class="d-flex align-items-center justify-content-between">
                <h1 class="text-capitalize mb-0">${pokemon.name}</h1>
                ${LikeService.getLikeButtonHTML(pokemon.id, pokemon.name)}
              </div>
              <small>Pokédex #${pokemon.id}</small>
            </div>
          </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <h3>Sprites</h3>
                  <div class="text-center">
                    ${pokemon.sprites.front_default ? `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name} front" class="img-fluid" loading="lazy">` : ""}
                    ${pokemon.sprites.back_default ? `<img src="${pokemon.sprites.back_default}" alt="${pokemon.name} back" class="img-fluid" loading="lazy">` : ""}
                  </div>
                  <div class="text-center mt-2">
                    ${pokemon.sprites.front_shiny ? `<img src="${pokemon.sprites.front_shiny}" alt="${pokemon.name} shiny front" class="img-fluid" loading="lazy">` : ""}
                    ${pokemon.sprites.back_shiny ? `<img src="${pokemon.sprites.back_shiny}" alt="${pokemon.name} shiny back" class="img-fluid" loading="lazy">` : ""}
                  </div>
                </div>
                
                <div class="col-md-8">
                  <div class="mb-3">
                    <h4>Types</h4>
                    <div>
                      ${typesIcons}
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <h4>Informations Physiques</h4>
                    <p><strong>Poids:</strong> ${pokemon.weight / 10} kg</p>
                    <p><strong>Taille:</strong> ${pokemon.height / 10} m</p>
                    <p><strong>Couleur:</strong> <span class="text-capitalize">${speciesData.color.name}</span></p>
                  </div>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <h4>Informations Physiques</h4>
                    <p><strong>Poids:</strong> ${pokemon.weight / 10} kg</p>
                    <p><strong>Taille:</strong> ${pokemon.height / 10} m</p>
                    <p><strong>Couleur:</strong> <span class="text-capitalize">${speciesData.color.name}</span></p>
                  </div>
                  
                  <div class="mb-3">
                    <h4>Talents</h4>
                    <ul>
                      ${pokemon.abilities
                        .map(
                          (ability) => `
                        <li class="text-capitalize">
                          ${ability.ability.name}${ability.is_hidden ? ' <span class="badge bg-warning text-dark">Caché</span>' : ""}
                        </li>
                      `,
                        )
                        .join("")}
                    </ul>
                  </div>
                  
                  <div class="mb-3">
                    <h4>Statistiques</h4>
                    ${pokemon.stats
                      .map(
                        (stat) => `
                      <div class="mb-2">
                        <div class="d-flex justify-content-between">
                          <span class="text-capitalize">${stat.stat.name}:</span>
                          <span>${stat.base_stat}</span>
                        </div>
                        <div class="progress">
                          <div class="progress-bar ${this.getStatColor(stat.base_stat)}" 
                               role="progressbar" 
                               style="width: ${(stat.base_stat / 255) * 100}%"
                               aria-valuenow="${stat.base_stat}" 
                               aria-valuemin="0" 
                               aria-valuemax="255">
                          </div>
                        </div>
                      </div>
                    `,
                      )
                      .join("")}
                  </div>
                  
                  <div class="mb-3">
                    <h4>Chaîne d'Évolution</h4>
                    <div class="d-flex align-items-center flex-wrap">
                      ${this.buildEvolutionChain(evolutionData.chain)}
                    </div>
                  </div>
                </div>
                <div class="">
                <a href="#/list/1" class="btn btn-secondary">← Retour à la liste</a>
              </div>
              </div>
              
              
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error details:", error);
      return `
        <div class="container mt-4">
          <div class="alert alert-danger">
            <h4>Erreur</h4>
            <p>Impossible de charger les détails du Pokémon: ${error.message}</p>
            <a href="#/list/1" class="btn btn-secondary">← Retour à la liste</a>
          </div>
        </div>
      `;
    }
  }

  getStatColor(value) {
    if (value >= 150) return "bg-danger";
    if (value >= 100) return "bg-warning";
    if (value >= 50) return "bg-info";
    return "bg-success";
  }

  buildEvolutionChain(chain) {
    let html = "";
    let current = chain;

    while (current) {
      const speciesName = current.species.name;
      const speciesId = current.species.url
        .split("/")
        .filter((x) => x)
        .pop();
      const level = current.evolution_details.length > 0 ? current.evolution_details[0].min_level : null;

      html += `
        <div class="text-center me-3 mb-2">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png" 
      alt="${speciesName}" 
      class="img-fluid" 
      style="max-width: 96px;" 
      loading="lazy">
          <p class="text-capitalize mb-0"> <a href="#/detail/${speciesId}" class="text-decoration-none">${speciesName}</a></p>
          <p class="mb-0"><small>${level ? `Niveau ${level}` : 'Évolution'}</small></p>
        </div>
      `;

      if (current.evolves_to && current.evolves_to.length > 0) {
        html += '<span class="me-3 mb-2">→</span>';
        current = current.evolves_to[0];
      } else {
        current = null;
      }
    }

    return html;
  }
}
