export default class HomePage {
  async render() {
    return `
      <section class="flex flex-col md:flex-row items-center min-h-[70vh] animate-in fade-in duration-500">
        <div class="w-full md:w-1/2 p-8 md:p-16">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">Aplikasi Berbagi Cerita <span class="text-blue-600">Mengasuh Anak</span></h1>
          <p class="text-xl text-gray-600 mt-6">Menghubungkan Orang Tua, Menginspirasi Komunitas.</p>
          <div class="mt-10">
            <a href="#/register" class="bg-orange-600 text-white px-8 py-3 rounded-md font-bold hover:bg-orange-700 shadow-md">Daftar Sekarang</a>
          </div>
        </div>
        <div class="w-full md:w-1/2">
          <img src="https://app.agnes-ai.com/gcs-agnes-default/images/JtZnAhg8.jpg" alt="Ilustrasi Komunitas Parenting" class="w-full h-full object-cover">
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Add any additional logic here if needed
  }

  showLoading() {
    document.getElementById('loading-container').innerHTML = `
      <div class="loader"></div>
    `;
  }

  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  } showLoading() {
    document.getElementById('loading-container').innerHTML = `
      <div class="loader"></div>
    `;
  }

  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  }
}
