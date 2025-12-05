// Función genérica para cargar el contenido de un archivo de texto
async function loadContent(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            // Manejo de errores HTTP, incluyendo 404
            throw new Error(`HTTP error! status: ${response.status} al cargar ${filePath}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error al cargar el archivo ${filePath}:`, error);
        return null;
    }
}

// Cargar y mostrar noticias
async function loadNews() {
    const newsContainer = document.getElementById('news-container');
    const newsText = await loadContent('./news.txt');

    if (!newsText) {
        newsContainer.innerHTML = '<p class="text-red-300 text-center p-4 bg-white/10 rounded-lg">No se pudieron cargar las noticias. Inténtalo de nuevo más tarde.</p>';
        return;
    }

    const lines = newsText.trim().split('\n');
    lines.forEach(line => {
        const [title, link, imageUrl] = line.split('|');
        if (title && link) {
            const newsCard = document.createElement('a');
            newsCard.href = link;
            newsCard.target = "_blank";
            // Uso de la clase 'news-card' unificada con mejor layout horizontal
            newsCard.className = 'news-card'; // Clase definida en style.css
            newsCard.innerHTML = `
                <img src="${imageUrl || 'https://placehold.co/80x80/CCCCCC/FFFFFF?text=NEWS'}" alt="${title}" class="news-image">
                <div class="news-text">
                    <span class="news-title">${title}</span>
                    <p class="text-sm text-gray-500 mt-1">Leer más <i class="fas fa-arrow-right text-xs ml-1"></i></p>
                </div>
            `;
            newsContainer.appendChild(newsCard);
        }
    });
}

// Cargar y mostrar secciones fijas
async function loadSections() {
    const sectionsContainer = document.getElementById('sections-container');
    const sectionsText = await loadContent('./sections.txt');

    if (!sectionsText) {
        sectionsContainer.innerHTML = '<p class="text-red-300 text-center p-4 bg-white/10 rounded-lg">No se pudieron cargar las secciones. Inténtalo de nuevo más tarde.</p>';
        return;
    }

    const lines = sectionsText.trim().split('\n');
    lines.forEach(line => {
        const [title, description, link, imageUrl] = line.split('|');
        if (title && description && link) {
            const card = document.createElement('div');
            // Uso de la clase unificada 'card-base' y otras de Tailwind
            card.className = 'card-base bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col items-center text-center transform hover:scale-105';
            card.innerHTML = `
                <div class="card-image-container w-full mb-4">
                    <img src="${imageUrl || 'https://placehold.co/400x180/CCCCCC/FFFFFF?text=Imagen+Seccion'}" alt="${title}" class="rounded-t-xl">
                </div>
                <div class="p-6 pt-0 flex flex-col items-center text-center flex-grow">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-2">${title}</h2>
                    <p class="text-gray-600">${description}</p>
                    <a href="${link}" class="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300">
                        Ver Más
                    </a>
                </div>
            `;
            // Aseguramos que la navegación sea correcta al hacer click
            card.querySelector('a').addEventListener('click', (e) => {
                e.stopPropagation(); // Previene que el evento del div padre se dispare
            });

            // Permite hacer clic en toda la tarjeta (excepto el enlace)
            card.addEventListener('click', () => {
                window.location.href = link;
            });

            sectionsContainer.appendChild(card);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadNews();
    loadSections();
});