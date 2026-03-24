export class Error404 {
  constructor(pokeProvider, container) {
    this.pokeProvider = pokeProvider;
    this.container = container;
  }

  async render() {
    return `Error 404`;
  }
}
