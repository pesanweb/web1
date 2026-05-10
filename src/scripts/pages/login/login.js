import authService from '../../services/auth-service';
import loadingManager from '../../utils/loading';

class LoginPage {
    async render() {
        return `
            <section class="container mx-auto px-6 py-16 flex justify-center animate-in fade-in duration-500">
                <div class="bg-white p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-100" role="main">
                    <h1 class="text-3xl font-bold mb-6 text-gray-800" id="login-heading">Halaman Login</h1>
                    <form id="loginForm" class="space-y-5" novalidate>
                        <div class="flex flex-col space-y-2">
                            <label for="email" class="font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                class="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="nama@email.com"
                                required
                                aria-required="true"
                                aria-describedby="email-error email-help"
                                autocomplete="email"
                            >
                            <div id="email-error" class="text-red-500 text-sm mt-1 hidden" role="alert"></div>
                            <p id="email-help" class="text-gray-500 text-sm">Masukkan alamat email yang valid</p>
                        </div>
                        <div class="flex flex-col space-y-2">
                            <label for="password" class="font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                class="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                                required
                                aria-required="true"
                                aria-describedby="password-error password-help"
                                autocomplete="current-password"
                            >
                            <div id="password-error" class="text-red-500 text-sm mt-1 hidden" role="alert"></div>
                            <p id="password-help" class="text-gray-500 text-sm">Minimal 8 karakter</p>
                        </div>
                        <button
                            type="submit"
                            class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-describedby="login-status"
                        >
                            Login
                        </button>
                        <div id="login-status" class="sr-only" role="status" aria-live="polite"></div>
                    </form>
                    <p class="mt-8 text-center text-gray-600">
                        Belum punya akun? <a href="#/register" class="text-blue-600 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2">Daftar di sini</a>
                    </p>
                </div>
            </section>
        `;
    }

    async afterRender() {
        const loginForm = document.querySelector('#loginForm');
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');

        // Form validation
        const validateForm = () => {
            let isValid = true;

            // Email validation
            const emailError = document.getElementById('email-error');
            if (!emailInput.value || !this.isValidEmail(emailInput.value)) {
                emailError.textContent = 'Masukkan alamat email yang valid';
                emailError.classList.remove('hidden');
                emailInput.setAttribute('aria-invalid', 'true');
                isValid = false;
            } else {
                emailError.classList.add('hidden');
                emailInput.setAttribute('aria-invalid', 'false');
            }

            // Password validation
            const passwordError = document.getElementById('password-error');
            if (!passwordInput.value || passwordInput.value.length < 8) {
                passwordError.textContent = 'Password minimal 8 karakter';
                passwordError.classList.remove('hidden');
                passwordInput.setAttribute('aria-invalid', 'true');
                isValid = false;
            } else {
                passwordError.classList.add('hidden');
                passwordInput.setAttribute('aria-invalid', 'false');
            }

            return isValid;
        };

        // Real-time validation
        emailInput.addEventListener('blur', validateForm);
        passwordInput.addEventListener('blur', validateForm);

        // Keyboard navigation
        loginForm.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.type === 'submit') {
                e.preventDefault();
                loginForm.dispatchEvent(new Event('submit'));
            }
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) {
                this.showNotification('Periksa form sebelum submit', 'error');
                return;
            }

            const formContainer = document.querySelector('.container');
            formContainer.classList.add('animate-out', 'fade-out', 'duration-500');

            loadingManager.show();
            try {
                const response = await authService.login({ email: emailInput.value, password: passwordInput.value });

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

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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