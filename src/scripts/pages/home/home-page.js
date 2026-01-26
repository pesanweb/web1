export default class HomePage {
  async render() {
    return `
     <section class="flex flex-col md:flex-row items-center min-h-[70vh] animate-in fade-in duration-500">
                        <div class="w-full md:w-1/2 p-8 md:p-16">
                            <h1 class="text-4xl md:text-5xl font-bold text-gray-800">Aplikasi Berbagi Cerita <span class="text-blue-600">Mengasuh Anak</span></h1>
                            <p class="text-xl text-gray-600 mt-6">Menghubungkan Orang Tua, Menginspirasi Komunitas.</p>
                        </div>
                        <div class="w-full md:w-1/2">
                            <img src="https://app.agnes-ai.com/gcs-agnes-default/images/JtZnAhg8.jpg" alt="Parenting" class="w-full h-full object-cover">
                        </div>
                    </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
