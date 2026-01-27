export default class AboutPage {
  async render() {
    return `
      <section class="container mx-auto px-6 py-20 max-w-4xl animate-in fade-in duration-500">
        <h1 class="text-4xl font-bold mb-8 text-gray-800">Tentang Sapiens AI</h1>
        <p class="text-xl leading-relaxed text-gray-700 mb-6">Kami adalah komunitas yang fokus pada edukasi pola asuh anak yang inklusif, menghubungkan orang tua di seluruh dunia untuk berbagi pengalaman berharga.</p>
        <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
          <p class="italic text-gray-600">"Anak-anak tidak membutuhkan orang tua yang sempurna, mereka membutuhkan orang tua yang bahagia dan terkoneksi."</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
