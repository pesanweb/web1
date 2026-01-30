import Camera from '../../utils/camera';
import StoriesApi from '../../data/api';
import * as L from 'leaflet';

class AddStoryPage {

  #camera;
  #map;
  #marker;
  #lat = null;
  #lon = null;

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
            
            <div class="space-y-4">
               <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h2 class="text-sm font-medium text-blue-800">Pentingnya Keluarga</h2>
                      <div class="mt-2 text-sm text-blue-700">
                        <p>Jagalah dirimu dan keluargamu dari api neraka. Abadikan momen berharga dan bagikan lokasi kebaikanmu untuk menginspirasi sesama.</p>
                      </div>
                    </div>
                  </div>
               </div>

              <label class="block text-gray-700 font-semibold mb-2">Lokasi (Opsional)</label>
              <div id="map" class="w-full h-64 rounded-lg border border-gray-300 z-0"></div>
              <p class="text-sm text-gray-500 mt-1">*Klik peta untuk menandai lokasi kejadian.</p>
            </div>

            <div>
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

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Anda harus login terlebih dahulu.');
      location.hash = '#/login';
      return;
    }

    const openCameraBtn = document.querySelector('#openCameraBtn');
    const cameraContainer = document.querySelector('#cameraContainer');
    const closeCameraBtn = document.querySelector('#closeCameraBtn');
    const takePictureBtn = document.querySelector('#takePictureBtn');

    this.#camera = new Camera({
      video: document.querySelector('#cameraVideo'),
      cameraSelect: document.querySelector('#cameraSelect'),
      canvas: document.querySelector('#cameraCanvas'),
    });

    this._initMap();

    photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          imagePreview.classList.remove('hidden');
          this.#closeCamera();
        };
        reader.readAsDataURL(file);
      }
    });

    removeImageBtn.addEventListener('click', () => {
      photoInput.value = '';
      previewImg.src = '';
      imagePreview.classList.add('hidden');
    });

    openCameraBtn.addEventListener('click', async () => {
      cameraContainer.classList.remove('hidden');
      imagePreview.classList.add('hidden');
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

        fetch(imageBlob)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera-capture.png", { type: "image/png" });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            photoInput.files = dataTransfer.files;
          });
      }
    });

    addStoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const description = document.querySelector('#description').value;
      const photo = document.querySelector('#photo').files[0];
      const lat = this.#lat;
      const lon = this.#lon;
      const loader = document.querySelector("#loader");

      if (!photo) {
        alert("Silakan pilih foto atau ambil gambar terlebih dahulu.");
        return;
      }

      if (loader) loader.style.display = "flex";
      try {
        await StoriesApi.addStory({ description, photo, lat, lon });

        // Show notification
        if (Notification.permission === 'granted') {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification('Cerita Terkirim! 🚀', {
              body: 'Cerita inspiratif anda berhasil dibagikan.',
              icon: '/images/logo.png',
              badge: '/favicon.png',
            });
          });
        }

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

  _initMap() {
    this.#map = L.map('map').setView([-6.200000, 106.816666], 13); // Default Jakarta

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);

    this.#map.on('click', (e) => {
      this._updateMarker(e.latlng.lat, e.latlng.lng);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.#map.setView([latitude, longitude], 13);
          this._updateMarker(latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation denied or failed:', error);
          alert('Gagal mendapatkan lokasi anda. Pastikan anda mengizinkan akses lokasi.');
        }
      );
    }
  }

  _updateMarker(lat, lng) {
    this.#lat = lat;
    this.#lon = lng;

    if (this.#marker) {
      this.#marker.setLatLng([lat, lng]);
    } else {
      this.#marker = L.marker([lat, lng]).addTo(this.#map);
    }
  }
}

export default AddStoryPage;
