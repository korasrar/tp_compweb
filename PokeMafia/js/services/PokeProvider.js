export class PokeProvider{
    constructor(apiEndpoint, jsonEndpoint){
        this.apiEndpoint = apiEndpoint;
        this.jsonEndpoint = jsonEndpoint;
        this.limit = 40; 
        this._notesCache = null;
    }

    async fetchPokemons(page = 1){
        try{
            const currentPage = page && page > 0 ? page : 1;
            const offset = (currentPage - 1) * this.limit;

            const pokes = await fetch(this.apiEndpoint + `pokemon?offset=${offset}&limit=${this.limit}`);
            const pokes_json  = await pokes.json();
            console.log(pokes_json);
            return pokes_json;
        }catch (err) {
            console.log('Error fetching pokemons : ', err);
            return null;
        }
    }

    async fetchPokemon(pokeId){
        try{
            const poke = await fetch(this.apiEndpoint + "pokemon/" + `${pokeId}`);
            const poke_json = await poke.json();
            console.log(poke_json);
            return poke_json
        }catch(err){
            console.log('Error fetching pokemon : ', err);
            return null;
        }
    }

    async fetchPokeSprite(pokeId){
        try{
            const poke = await fetch(this.apiEndpoint + "pokemon/" + `${pokeId}`);
            const poke_json = await poke.json();
            console.log(poke_json);
            console.log(poke_json.sprites.front_default)
            return poke_json.sprites.front_default
        }catch(err){
            console.log('Error fetching pokemon sprite : ', err);
            return null;
        }
    }

    async fetchPokesNotes(){
        try{
            if (this._notesCache) {
                return this._notesCache;
            }

            const pokes_notes = await fetch(this.jsonEndpoint + "notes");
            const pokes_notes_json = await pokes_notes.json();
            console.log(pokes_notes_json);

            this._notesCache = pokes_notes_json;
            return pokes_notes_json;
        }catch(err){
            console.log('Error fetching pokemon grades : ', err);
            return null;
        }
    }

    async fetchPokeNote(pokeId){
        try{
            const poke_note = await fetch(this.jsonEndpoint + "notes" + `?pokeId=${pokeId}`)
            const poke_note_json = await poke_note.json();
            console.log(poke_note_json)
            return poke_note_json.length >= 0 ? poke_note_json["0"].note : "?";
        }catch(err){
            console.log('Error fetching pokemon grade : ', err);
            return "?";
        }
    }

    async updatePokeNote(pokeId, note) {
        try {
            const existing = await fetch(this.jsonEndpoint + "notes" + `?pokeId=${pokeId}`);
            const existingJson = await existing.json();
            
            if (existingJson.length > 0) {
                const noteId = existingJson[0].id;
                await fetch(this.jsonEndpoint + "notes/" + noteId, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ note: note }),
                });
            } else {
                await fetch(this.jsonEndpoint + "notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pokeId: pokeId, note: note }),
                });
            }

            this._notesCache = null;
            return true;
        } catch (err) {
            console.log('Error updating pokemon grade : ', err);
            return false;
        }
    }

    async fetchSpeciesPokemon(pokemon){
        try{
            const speciesResponse = await fetch(pokemon.species.url);
            const speciesData = await speciesResponse.json();
            console.log(speciesData);
            return speciesData;
        }catch(err){
            console.log('Error fetching pokemon species : ', err);
            return null;
        }
    }

    async fetchEvolutionChain(speciesData){
        try{
            const evolutionResponse = await fetch(speciesData.evolution_chain.url);
            const evolutionData = await evolutionResponse.json();
            console.log(evolutionData);
            return evolutionData;
        }catch(err){
            console.log('Error fetching pokemon evolution chain : ', err);
            return null;
        }
    }

}
