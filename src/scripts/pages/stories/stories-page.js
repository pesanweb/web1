import StoriesApi from '../../data/api';
import * as L from 'leaflet';
import FavoriteStoryIdb from '../../data/favorite-story-idb';

class StoriesPage {
  async render() {
    return `
      <section class="container mx-auto px-6 py-10">
        <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Cerita Pengguna</h1>
        
        <div id="map" class="w-full h-96 rounded-xl shadow-lg mb-8 z-0"></div>

        <div id="stories-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Stories will be loaded here -->
          <div class="col-span-full text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p class="mt-2 text-gray-600">Memuat cerita...</p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const storiesContainer = document.querySelector('#stories-container');

    // Initialize Map
    const map = L.map('map').setView([-6.200000, 106.816666], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    try {
      const response = await StoriesApi.getAllStories({ location: 1 });
      const stories = response.listStory;

      if (stories.length === 0) {
        storiesContainer.innerHTML = '<p class="col-span-full text-center text-gray-600">Belum ada cerita.</p>';
        return;
      }

      storiesContainer.innerHTML = '';

      const latlngs = [];

      // Fetch all favorites to check status
      const favoriteStories = await FavoriteStoryIdb.getAllStories();
      const favoriteIds = favoriteStories.map(s => s.id);

      stories.forEach(story => {
        const isFavorite = favoriteIds.includes(story.id);
        storiesContainer.innerHTML += this._createStoryItemTemplate(story, isFavorite);

        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`
                        <div class="test-sm font-semibold">${story.name}</div>
                        <p class="text-xs line-clamp-2">${story.description}</p>
                    `);
          latlngs.push([story.lat, story.lon]);
        }
      });

      // Add event listeners for favorite buttons
      storiesContainer.querySelectorAll('.favorite-button').forEach(button => {
        button.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent card click
          const storyId = button.dataset.id;
          const storyData = stories.find(s => s.id === storyId);

          if (button.classList.contains('is-favorite')) {
            await FavoriteStoryIdb.deleteStory(storyId);
            button.classList.remove('is-favorite', 'text-red-500');
            button.classList.add('text-gray-400');
            button.innerHTML = '&#9825;'; // Empty heart
          } else {
            await FavoriteStoryIdb.putStory(storyData);
            button.classList.add('is-favorite', 'text-red-500');
            button.classList.remove('text-gray-400');
            button.innerHTML = '&#10084;'; // Filled heart
          }
        });
      });

      if (latlngs.length > 0) {
        map.fitBounds(latlngs);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          map.setView([position.coords.latitude, position.coords.longitude], 13);
        });
      }

    } catch (error) {
      storiesContainer.innerHTML = `<p class="col-span-full text-center text-red-600">Gagal memuat cerita: ${error.message}</p>`;
    }
  }

  _createStoryItemTemplate(story, isFavorite) {
    return `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group story-item" data-storyid="${story.id}">
        <button class="favorite-button absolute top-4 right-4 z-20 p-3 bg-white rounded-full shadow-md ${isFavorite ? 'is-favorite text-red-500' : 'text-gray-400'} hover:scale-125 transition-transform text-2xl" data-id="${story.id}" aria-label="Simpan ke favorit">
          ${isFavorite ? '&#10084;' : '&#9825;'}
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

export default StoriesPage;
