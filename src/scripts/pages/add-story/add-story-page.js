import StoriesApi from '../../data/api';

class AddStoryPage {
    async render() {
        return `
      <section class="container mx-auto px-6 py-10 flex justify-center">
        <div class="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
          <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Tambah Cerita Baru</h1>
          <form id="addStoryForm" class="space-y-6">
            <div>
              <label for="description" class="block text-gray-700 font-semibold mb-2">Deskripsi</label>
              <textarea id="description" name="description" rows="4" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ceritakan pengalamanmu..." required></textarea>
            </div>
            <div>
              <label for="photo" class="block text-gray-700 font-semibold mb-2">Foto</label>
              <input type="file" id="photo" name="photo" accept="image/*" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <div id="imagePreview" class="mt-4 hidden">
                <img src="" alt="Preview" class="w-full h-64 object-cover rounded-lg">
              </div>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all">Upload Cerita</button>
          </form>
        </div>
      </section>
    `;
    }

    async afterRender() {
        const addStoryForm = document.querySelector('#addStoryForm');
        const photoInput = document.querySelector('#photo');
        const imagePreview = document.querySelector('#imagePreview');
        const previewImg = imagePreview.querySelector('img');

        photoInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.classList.add('hidden');
            }
        });

        addStoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const description = document.querySelector('#description').value;
            const photo = document.querySelector('#photo').files[0];
            const loader = document.querySelector("#loader");

            if (!photo) {
                alert("Silakan pilih foto terlebih dahulu.");
                return;
            }

            loader.style.display = "flex";
            try {
                await StoriesApi.addStory({ description, photo });
                alert("Cerita berhasil ditambahkan!");
                location.hash = '#/stories';
            } catch (error) {
                alert(`Gagal menambahkan cerita: ${error.message}`);
            } finally {
                loader.style.display = "none";
            }
        });
    }
}

export default AddStoryPage;
