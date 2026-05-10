import authService from '../../services/auth-service';
import loadingManager from '../../utils/loading';

class LoginPage {
    async render() {
        return `
            <section class="container mx-auto px-6 py-16 flex justify-center animate-in fade-in duration-500">
                <div class="bg-white p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
                    <h1 class="text-3xl font-bold mb-6 text-gray-800">Halaman Login</h1>
                    <form id="loginForm" class="space-y-5">
                        <div class="flex flex-col space-y-2">
                            <label for="email" class="font-semibold text-gray-700">Email</label>
                            <input type="email" id="email" class="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="nama@email.com" required>
                        </div>
                        <div class="flex flex-col space-y-2">
                            <label for="password" class="font-semibold text-gray-700">Password</label>
                            <input type="password" id="password" class="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all">Login</button>
                    </form>
                    <p class="mt-8 text-center text-gray-600">
                        Belum punya akun? <a href="#/register" class="text-blue-600 font-bold hover:underline">Daftar di sini</a>
                    </p>
                </div>
            </section>
        `;
    }

    async afterRender() {
        const loginForm = document.querySelector('#loginForm');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            const formContainer = document.querySelector('.container');
            formContainer.classList.add('animate-out', 'fade-out', 'duration-500');

            loadingManager.show();
            try {
                const response = await authService.login({ email, password });

                // Show success message
                this.showNotification('Login Berhasil!', 'success');

                setTimeout(() => {
                    location.hash = '#/';
                }, 500);
            } catch (error) {
                this.showNotification(`Login gagal: ${error.message}`, 'error');
                formContainer.classList.remove('animate-out', 'fade-out');
            } finally {
                loadingManager.hide();
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('animate-out', 'fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

export default LoginPage;