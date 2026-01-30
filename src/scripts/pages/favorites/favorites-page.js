import FavoriteStoryIdb from '../../data/favorite-story-idb';

class FavoritesPage {
  async render() {
    return `
      <section class="container mx-auto px-6 py-10">
        <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Cerita Favorit</h1>
        
        <div id="stories-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Favorite stories will be loaded here -->
          <div class="col-span-full text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p class="mt-2 text-gray-600">Memuat cerita favorit...</p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const storiesContainer = document.querySelector('#stories-container');

    try {
      const stories = await FavoriteStoryIdb.getAllStories();

      if (stories.length === 0) {
        storiesContainer.innerHTML = `
          <div class="col-span-full text-center py-20">
            <p class="text-gray-500 text-xl">Belum ada cerita favorit.</p>
            <a href="#/stories" class="mt-4 inline-block text-blue-600 hover:underline">Cari cerita menarik di sini</a>
          </div>
        `;
        return;
      }

      storiesContainer.innerHTML = '';

      stories.forEach(story => {
        storiesContainer.innerHTML += this._createStoryItemTemplate(story);
      });

      // Add event listeners for unfavorite buttons
      storiesContainer.querySelectorAll('.favorite-button').forEach(button => {
        button.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent card click
          const storyId = button.dataset.id;
          await FavoriteStoryIdb.deleteStory(storyId);
          await this.afterRender();
        });
      });

    } catch (error) {
      storiesContainer.innerHTML = `<p class="col-span-full text-center text-red-600">Gagal memuat cerita favorit: ${error.message}</p>`;
    }
  }

  _createStoryItemTemplate(story) {
    return `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group">
        <button class="favorite-button absolute top-4 right-4 z-20 p-3 bg-white rounded-full shadow-md is-favorite text-red-500 hover:scale-125 transition-transform text-2xl" data-id="${story.id}" aria-label="Hapus dari favorit">
          &#10084;
        </button>
        <a href="#/stories/${story.id}" class="block h-full">
            <img src="${story.photoUrl}" alt="${story.name}" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="p-6">
                <h2 class="font-bold text-xl mb-2 text-gray-800">${story.name}</h2>
                <p class="text-gray-600 text-sm mb-4">
                  <span class="mr-1">&#128197;</span>
                  ${new Date(story.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p class="text-gray-700 line-clamp-3">${story.description}</p>
            </div>
        </a>
      </div>
    `;
  }
}

export default FavoritesPage;
