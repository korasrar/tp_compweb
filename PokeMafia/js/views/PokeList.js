export class PokeList {
  constructor(pokeProvider, container) {
    this.pokeProvider = pokeProvider;
    this.container = container;
  }

  async render(page){
    try {
      const request = await this.pokeProvider.fetchPokemons();
      
      const pokemons = request["results"];
      
      let html = `<div class="container mt-4">
                    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">`;

      for(const pokemon in pokemons){
        let poke = pokemons[pokemon]
        let poke_note = await this.pokeProvider.fetchPokeNote(this.getPokeId(poke.url))
        let sprite = await this.pokeProvider.fetchPokeSprite(this.getPokeId(poke.url))
        console.log(sprite);
        html += ` 
          <div class="col">
            <div class="card h-100 shadow-sm text-center">
              <div class="card-body d-flex flex-column align-items-center justify-content-center">
                <img src="${sprite}" alt="${poke.name} front" class="img-fluid mb-3" style="max-width: 96px;">
                <h5 class="card-title text-capitalize mb-3">${poke.name}</h5>
                <span class="badge bg-primary mt-auto fs-6">Note : ${poke_note}</span>
              </div>
            </div>
          </div>
        `;
      }
    
      html += `   </div>
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
