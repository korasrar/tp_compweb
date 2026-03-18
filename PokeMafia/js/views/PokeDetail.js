export class PokeDetail {
  constructor(pokeProvider, container) {
    this.pokeProvider = pokeProvider;
    this.container = container;
  }

  async render(id) {
    try {
      const pokemon = await this.pokeProvider.fetchPokemon(id);
      return `
      <h1>${pokemon.name}</h1>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
    `;
    } catch (error) {
      return `<p>Error fetching Pokémon details: ${error.message}</p>`;
    }
  }
}
