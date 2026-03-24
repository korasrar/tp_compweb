export class PokeList {
  constructor(pokeProvider, container) {
    this.pokeProvider = pokeProvider;
    this.container = container;
  }

  async render(page){
    try {
      const request = await this.pokeProvider.fetchPokemons();
      
      const pokemons = request["results"];
      
      let html = "";

      for(const pokemon in pokemons){
        let poke = pokemons[pokemon]
        let sprite = await this.pokeProvider.fetchPokeSprite(parseInt(pokemon)+1)
        console.log(sprite);
        html += ` <div class="card"> 
                      <h2> ${poke.name}</h2>
                      <img src="${sprite}" alt="${poke.name} front" class="img-fluid">
                  </div>
        `

      }
    
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

}
