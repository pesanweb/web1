import StoriesApi from '../../data/api';
import * as L from 'leaflet';

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
    const map = L.map('map').setView([-6.200000, 106.816666], 13); // Default Jakarta (or center of Indonesia)
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

      // Bounds to fit all markers
      const latlngs = [];

      stories.forEach(story => {
        storiesContainer.innerHTML += this._createStoryItemTemplate(story);

        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`
                        <div class="test-sm font-semibold">${story.name}</div>
                        <p class="text-xs line-clamp-2">${story.description}</p>
                    `);
          latlngs.push([story.lat, story.lon]);
        }
      });

      if (latlngs.length > 0) {
        map.fitBounds(latlngs);
      } else if (navigator.geolocation) {
        // Fallback to user location if no story has coordinates
        navigator.geolocation.getCurrentPosition((position) => {
          map.setView([position.coords.latitude, position.coords.longitude], 13);
        });
      }

    } catch (error) {
      storiesContainer.innerHTML = `<p class="col-span-full text-center text-red-600">Gagal memuat cerita: ${error.message}</p>`;
    }
  }

  _createStoryItemTemplate(story) {
    return `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img src="${story.photoUrl}" alt="${story.name}" class="w-full h-64 object-cover">
        <div class="p-6">
          <h3 class="font-bold text-xl mb-2 text-gray-800">${story.name}</h3>
          <p class="text-gray-600 text-sm mb-4">${new Date(story.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p class="text-gray-700 line-clamp-3">${story.description}</p>
        </div>
      </div>
    `;
  }
}

export default StoriesPage;
