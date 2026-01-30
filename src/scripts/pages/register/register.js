import StoriesApi from "../../data/api";

class RegisterPage {
    async render() {
        return `
            <section class="container mx-auto px-6 py-16 flex justify-center">
                <div class="bg-white p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
                    <h1 class="text-3xl font-bold mb-6 text-gray-800">Halaman Register</h1>
                    <form id="registerForm" class="space-y-5">
                        <div class="flex flex-col space-y-2">
                            <label for="name" class="font-semibold text-gray-700">Nama Lengkap</label>
                            <input type="text" id="name" class="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nama Anda" required>
                        </div>
                        <div class="flex flex-col space-y-2">
                            <label for="email" class="font-semibold text-gray-700">Email</label>
                            <input type="email" id="email" class="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="email@contoh.com" required>
                        </div>
                        <div class="flex flex-col space-y-2">
                            <label for="password" class="font-semibold text-gray-700">Password</label>
                            <input type="password" id="password" class="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Min. 8 karakter" required>
                        </div>
                        <button type="submit" class="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 shadow-md transition-all">Daftar</button>
                    </form>
                    <p class="mt-8 text-center text-gray-600">
                        Sudah punya akun? <a href="#/login" class="text-blue-600 font-bold hover:underline">Login di sini</a>
                    </p>
                </div>
            </section>
        `;
    }

    async afterRender() {
        const registerForm = document.querySelector("#registerForm");
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.querySelector("#name").value;
            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;

            const loader = document.querySelector("#loader");
            loader.style.display = "flex";
            try {
                await StoriesApi.register({ name, email, password });
                alert("Registrasi berhasil! Silakan login.");
                location.hash = "#/login";
            } catch (e) {
                alert(`Registrasi gagal: ${e.message}`);
            } finally {
                loader.style.display = "none";
            }
        });
    }

}

export default RegisterPage;