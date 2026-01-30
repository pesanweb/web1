import StoriesApi from "../../data/api";
import L from "leaflet"; // Import JS Leaflet

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css"; // Import CSS Leaflet
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
// Atur ulang icon default Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
});

const Dashboard = {
    async render() {
        return `
            <section class="container mx-auto px-6 py-16 flex justify-center animate-in fade-in duration-500">
                <div class="bg-white p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
                    <h1 class="text-2xl font-bold text-center text-gray-800 mb-8">Dashboard</h1>
                    <div id="map" class="h-96 rounded-md border border-gray-300"></div>
                </div>
            </section>
        `;
    },

    async afterRender() {
        const map = L.map('map').setView([-7.2575, 112.7521], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    },

};

export default Dashboard;