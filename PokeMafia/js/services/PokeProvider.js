export class PokeProvider{
    constructor(apiEndpoint){
        this.apiEndpoint = apiEndpoint;
        this.jsonEndpoint = jsonEndpoint;
    }

    async fetchPokemons(){
        try{
            const pokes = await fetch(this.apiEndpoint + "pokemon");
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

    async fetchPokesNotes(){
        try{
            const pokes_notes = await fetch(this.jsonEndpoint + "notes");
            const pokes_notes_json = await pokes_notes.json()
            console.log(pokes_notes_json);
            return pokes_notes_json
        }catch(err){
            console.log('Error fetching pokemon grades : ', err);
            return null;
        }
    }


}