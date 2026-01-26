export default class AboutPage {
  async render() {
    return `
    <section class="container mx-auto px-6 py-20">
                        <h1 class="text-4xl font-bold mb-6">Tentang Kami</h1>
                        <p class="text-lg text-gray-700">Kami adalah komunitas Sapiens AI yang fokus pada edukasi pola asuh anak yang inklusif.</p>
                    </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
