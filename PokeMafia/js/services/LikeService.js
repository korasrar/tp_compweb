export class LikeService {
  static isLiked(pokemonId) {
    return localStorage.getItem(`${pokemonId}`) === 'true';
  }

  static toggleLike(pokemonId) {
    const currentState = this.isLiked(pokemonId);
    localStorage.setItem(`${pokemonId}`, !currentState);
    return !currentState;
  }

  static setLike(pokemonId, state) {
    localStorage.setItem(`${pokemonId}`, state);
  }

  static getLikeButtonHTML(pokemonId, pokemonName) {
    const isLiked = this.isLiked(pokemonId);
    return `
      <button class="btn btn-${isLiked ? 'danger' : 'outline-danger'} like-btn" data-pokemon-id="${pokemonId}" data-pokemon-name="${pokemonName}">
        <i class="fas fa-heart"></i> ${isLiked ? 'Unlike' : 'Like'}
      </button>
    `;
  }

  static attachEventListeners(container) {
    const likeButtons = container.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const pokemonId = button.dataset.pokemonId;
        const newState = this.toggleLike(pokemonId);
        
        button.className = `btn btn-${newState ? 'danger' : 'outline-danger'} like-btn`;
        button.innerHTML = `<i class="fas fa-heart"></i> ${newState ? 'Unlike' : 'Like'}`;
      });
    });
  }
}
