import Camera from '../../utils/camera';
import StoriesApi from '../../data/api';

class AddStoryPage {

  #camera;

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
              <label class="block text-gray-700 font-semibold mb-2">Foto</label>
              
              <div class="flex gap-4 mb-4">
                <button type="button" id="openCameraBtn" class="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all">
                  Buka Kamera
                </button>
                <label for="photo" class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all text-center cursor-pointer flex items-center justify-center">
                  Upload File
                </label>
                <input type="file" id="photo" name="photo" accept="image/*" class="hidden">
              </div>

              <div id="cameraContainer" class="hidden mb-4 bg-black rounded-lg overflow-hidden relative">
                <video id="cameraVideo" autoplay playsinline class="w-full h-64 object-cover"></video>
                <canvas id="cameraCanvas" class="hidden"></canvas>
                <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
                  <select id="cameraSelect" class="bg-white/80 text-gray-800 rounded px-2 py-1 text-sm"></select>
                  <button type="button" id="takePictureBtn" class="bg-white text-black w-12 h-12 rounded-full border-4 border-gray-300 hover:border-blue-500 transition-all flex items-center justify-center">
                    <div class="w-8 h-8 bg-red-500 rounded-full"></div>
                  </button>
                  <button type="button" id="closeCameraBtn" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Tutup</button>
                </div>
              </div>

              <div id="imagePreview" class="mt-4 hidden relative group">
                <img src="" alt="Preview" class="w-full h-64 object-cover rounded-lg border border-gray-200">
                <button type="button" id="removeImageBtn" class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
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
    const removeImageBtn = document.querySelector('#removeImageBtn');

    const openCameraBtn = document.querySelector('#openCameraBtn');
    const cameraContainer = document.querySelector('#cameraContainer');
    const closeCameraBtn = document.querySelector('#closeCameraBtn');
    const takePictureBtn = document.querySelector('#takePictureBtn');

    // Initialize Camera
    this.#camera = new Camera({
      video: document.querySelector('#cameraVideo'),
      cameraSelect: document.querySelector('#cameraSelect'),
      canvas: document.querySelector('#cameraCanvas'),
    });

    // File Input Handler
    photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          imagePreview.classList.remove('hidden');
          // Hide camera if open
          this.#closeCamera();
        };
        reader.readAsDataURL(file);
      }
    });

    // Remove Image Handler
    removeImageBtn.addEventListener('click', () => {
      photoInput.value = '';
      previewImg.src = '';
      imagePreview.classList.add('hidden');
    });

    // Camera Handlers
    openCameraBtn.addEventListener('click', async () => {
      cameraContainer.classList.remove('hidden');
      imagePreview.classList.add('hidden'); // Hide preview when opening camera
      await this.#camera.launch();
    });

    closeCameraBtn.addEventListener('click', () => {
      this.#closeCamera();
    });

    takePictureBtn.addEventListener('click', () => {
      const imageBlob = this.#camera.takePicture();
      if (imageBlob) {
        previewImg.src = imageBlob;
        imagePreview.classList.remove('hidden');
        this.#closeCamera();

        // Convert data URL to File object for submission
        fetch(imageBlob)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera-capture.png", { type: "image/png" });

            // Create a DataTransfer to update the file input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            photoInput.files = dataTransfer.files;
          });
      }
    });

    // Form Submit Handler
    addStoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const description = document.querySelector('#description').value;
      const photo = document.querySelector('#photo').files[0];
      const loader = document.querySelector("#loader");

      if (!photo) {
        alert("Silakan pilih foto atau ambil gambar terlebih dahulu.");
        return;
      }

      if (loader) loader.style.display = "flex";
      try {
        await StoriesApi.addStory({ description, photo });
        alert("Cerita berhasil ditambahkan!");
        location.hash = '#/stories';
      } catch (error) {
        alert(`Gagal menambahkan cerita: ${error.message}`);
      } finally {
        if (loader) loader.style.display = "none";
      }
    });
  }

  #closeCamera() {
    const cameraContainer = document.querySelector('#cameraContainer');
    this.#camera.stop();
    cameraContainer.classList.add('hidden');
  }
}

export default AddStoryPage;
