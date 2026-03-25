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
        let poke_note = await this.pokeProvider.fetchPokeNote(this.getPokeId(poke.url))
        let sprite = await this.pokeProvider.fetchPokeSprite(this.getPokeId(poke.url))
        console.log(sprite);
        html += ` <div class="card"> 
                      <h2> ${poke.name}</h2>
                      <img src="${sprite}" alt="${poke.name} front" class="img-fluid">
                      <p> ${poke_note} </p>
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
