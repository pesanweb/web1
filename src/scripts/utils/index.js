export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
            console.log('ServiceWorker registered');
        } catch (error) {
            console.error('ServiceWorker registration failed:', error);
        }
    }
};

export const initInstallPrompt = () => {
    const installButton = document.querySelector('#install-button');
    const installButtonMobile = document.querySelector('#install-button-mobile');
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installButton) installButton.classList.remove('hidden');
        if (installButtonMobile) installButtonMobile.classList.remove('hidden');
    });

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        if (installButton) installButton.classList.add('hidden');
        if (installButtonMobile) installButtonMobile.classList.add('hidden');
    };

    if (installButton) installButton.addEventListener('click', handleInstall);
    if (installButtonMobile) installButtonMobile.addEventListener('click', handleInstall);
};
