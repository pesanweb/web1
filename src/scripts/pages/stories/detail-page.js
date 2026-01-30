import StoriesApi from '../../data/api';
import FavoriteStoryIdb from '../../data/favorite-story-idb';
import * as UrlParser from '../../routes/url-parser';

class DetailPage {
    async render() {
        return `
      <section class="container mx-auto px-6 py-10 animate-in fade-in duration-500">
        <div id="detail-toolbar" class="flex flex-wrap gap-4 mb-8">
            <button id="back-button" class="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 shadow-lg transition-all flex items-center text-lg">
                <span class="mr-2 text-2xl">⬅</span> Kembali
            </button>
            <button id="favorite-toggle" class="bg-green-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-900 shadow-lg transition-all flex items-center text-lg">
                <span class="mr-2 text-2xl">⭐</span> Simpan Story
            </button>
            <a href="#/favorites" class="bg-green-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-900 shadow-lg transition-all flex items-center text-lg">
                <span class="mr-2 text-2xl">📌</span> Lihat Story Favorit
            </a>
        </div>

        <div id="story-detail-container" class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div class="p-20 text-center">
                <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <p class="mt-4 text-xl text-gray-600">Memuat detail cerita...</p>
            </div>
        </div>
      </section>
    `;
    }

    async afterRender() {
        const url = UrlParser.parseActivePathname();
        const storyId = url.id;
        const container = document.querySelector('#story-detail-container');
        const favoriteBtn = document.querySelector('#favorite-toggle');
        const backBtn = document.querySelector('#back-button');

        backBtn.addEventListener('click', () => {
            window.history.back();
        });

        try {
            const response = await StoriesApi.getStoryDetail(storyId);
            const story = response.story;

            const isFavorite = !!(await FavoriteStoryIdb.getStory(storyId));
            this._updateFavoriteButton(favoriteBtn, isFavorite);

            container.innerHTML = this._createStoryDetailTemplate(story);

            favoriteBtn.onclick = async () => {
                const currentFavorite = !!(await FavoriteStoryIdb.getStory(storyId));
                if (currentFavorite) {
                    await FavoriteStoryIdb.deleteStory(storyId);
                    this._updateFavoriteButton(favoriteBtn, false);
                } else {
                    await FavoriteStoryIdb.putStory(story);
                    this._updateFavoriteButton(favoriteBtn, true);
                }
            };

        } catch (error) {
            container.innerHTML = `
        <div class="p-20 text-center">
            <p class="text-red-600 font-bold text-2xl mb-4">Gagal memuat detail cerita</p>
            <p class="text-gray-500">${error.message}</p>
        </div>
      `;
        }
    }

    _updateFavoriteButton(btn, isFavorite) {
        if (isFavorite) {
            btn.innerHTML = '<span class="mr-2 text-2xl">⭐</span> Terfavorit';
            btn.classList.add('bg-yellow-600', 'hover:bg-yellow-700');
            btn.classList.remove('bg-green-800', 'hover:bg-green-900');
        } else {
            btn.innerHTML = '<span class="mr-2 text-2xl">⭐</span> Simpan Story';
            btn.classList.add('bg-green-800', 'hover:bg-green-900');
            btn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
        }
    }

    _createStoryDetailTemplate(story) {
        return `
      <div class="flex flex-col">
        <img src="${story.photoUrl}" alt="${story.name}" class="w-full max-h-[600px] object-contain bg-gray-50">
        <div class="p-8 md:p-12">
          <h1 class="text-5xl font-extrabold text-gray-900 mb-6">${story.name}</h1>
          <div class="flex items-center text-gray-600 mb-8 border-b pb-6">
            <span class="mr-6 flex items-center text-xl">
                <span class="mr-2 text-2xl">📅</span>
                ${new Date(story.createdAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/\./g, ':')}
            </span>
          </div>

          <div class="text-2xl text-gray-800 mb-12 leading-relaxed whitespace-pre-line">
            ${story.description}
          </div>

          ${story.lat && story.lon ? `
            <div class="bg-blue-50 p-8 rounded-2xl border border-blue-100 flex items-start">
                <span class="text-3xl mr-6 text-red-600 text-shadow">📍</span>
                <div>
                    <h3 class="font-extrabold text-gray-900 mb-2 text-xl">Lokasi</h3>
                    <p class="text-gray-700 font-mono text-lg font-medium">${story.lat}, ${story.lon}</p>
                </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    }
}

export default DetailPage;
