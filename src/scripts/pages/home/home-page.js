export default class HomePage {
  async render() {
    return `
      <section class="flex flex-col md:flex-row items-center min-h-[70vh] animate-in fade-in duration-500">
        <div class="w-full md:w-1/2 p-8 md:p-16">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">Pengenalan: Dunia Pengasuhan <span class="text-pink-500">Modern</span></h1>
          
          <div class="mt-8 space-y-6 text-gray-700">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                Tantangan Orang Tua di Era Digital
              </h2>
              <ul class="space-y-2">
                <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Digital gap antara orang tua & remaja.</li>
                <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Bingung & khawatir melihat anak tumbuh di dunia digital.</li>
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Kebutuhan filter etis dari nilai konsumtif & kekerasan.</li>
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Manajemen durasi gawai & pemilihan konten.</li>
              </ul>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                Kebutuhan Dukungan & Komunitas
              </h2>
              <ul class="space-y-2">
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Mengatasi gap digital & kekhawatiran bersama.</li>
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Berbagi strategi parenting efektif di era modern.</li>
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Membangun jejaring untuk solusi tantangan.</li>
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Merasa tidak sendiri dalam perjalanan pengasuhan.</li>
              </ul>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-gray-800 flex items-center mb-4">
                Peluang Berbagi Pengalaman
              </h2>
              <ul class="space-y-2">
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Inspirasi dari kisah & praktik parenting lain.</li>
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Pembelajaran timbal balik antar orang tua.</li>
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Membangun lingkungan pengasuhan yang suportif.</li>
                 <li class="flex items-start"><span class="mr-2 text-pink-500">&bull;</span>Meningkatkan kepercayaan diri dalam mendidik anak.</li>
              </ul>
            </div>
          </div>

          <div class="mt-10">
            <a href="#/register" class="inline-block bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 shadow-md transition-all transform hover:scale-105">Mulai Berbagi</a>
          </div>
        </div>
        <div class="w-full md:w-1/2 p-8">
          <img src="https://app.agnes-ai.com/gcs-agnes-default/images/JtZnAhg8.jpg" alt="Ilustrasi Komunitas Parenting" class="w-full h-auto object-cover rounded-2xl shadow-2xl">
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Check if user is logged in
    // Check if user is logged in
    const token = localStorage.getItem('token');
    // if (token) {
    //   location.hash = '#/stories';
    // }
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
