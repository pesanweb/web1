export function generateSubscribeButtonTemplate() {
  return `
      <button id="subscribe-button" class="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center transition-colors" aria-label="Subscribe to notifications">
          <span class="mr-2">🔔</span> Langganan
      </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
      <button id="subscribe-button" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center transition-colors" aria-label="Unsubscribe from notifications">
          <span class="mr-2">🔕</span> Berhenti Langganan
      </button>
  `;
}

