export class PokeProvider{
    constructor(apiEndpoint){
        this.apiEndpoint = apiEndpoint;
    }

    static fetchPokemons = async () => {
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

    static fetchPokemon = async (pokeId) => {
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
}