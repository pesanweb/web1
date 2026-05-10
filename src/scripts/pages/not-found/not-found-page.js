export default class NotFoundPage {
  async render() {
    return `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <div class="mb-8">
            <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 class="text-2xl font-semibold text-gray-700 mb-2">Halaman Tidak Ditemukan</h2>
          <p class="text-gray-600 mb-8">Maaf, halaman yang Anda cari tidak tersedia.</p>
          <div class="space-x-4">
            <a href="#/" class="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Kembali ke Beranda
            </a>
            <button onclick="history.back()" class="inline-block bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors">
              Kembali
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Add any additional initialization if needed
  }
}