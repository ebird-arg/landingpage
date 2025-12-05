// Función genérica para cargar el contenido de un archivo de texto
async function loadContent(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} al cargar ${filePath}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error al cargar el archivo ${filePath}:`, error);
        return null;
    }
}

// Lógica para manejar el colapso/expansión de las secciones
function setupCollapsible(headerButton) {
    headerButton.addEventListener('click', function() {
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            content.classList.remove('active');
        } else {
            // Usamos scrollHeight para que el max-height se ajuste al contenido real
            content.style.maxHeight = content.scrollHeight + "px";
            content.classList.add('active');
        }
    });
}

// Cargar y mostrar aves
async function loadBirds() {
    const familiesContainer = document.getElementById('families-container');
    const birdText = await loadContent('./ave-semana.txt');

    if (!birdText) {
        familiesContainer.innerHTML = '<p class="text-red-300 text-center p-4 bg-white/10 rounded-lg">No se pudieron cargar las aves. Inténtalo de nuevo más tarde.</p>';
        return;
    }

    const lines = birdText.trim().split('\n');
    let currentFamily = null;
    const familiesData = {};

    // 1. Parsear los datos del archivo
    lines.forEach(line => {
        if (line.startsWith('--')) {
            const [, familyInfo] = line.split('--');
            const [familyName, familyImageUrl] = familyInfo.split('|');
            currentFamily = familyName.trim();
            familiesData[currentFamily] = {
                imageUrl: familyImageUrl ? familyImageUrl.trim() : 'https://placehold.co/48x48/CCCCCC/FFFFFF?text=F',
                birds: []
            };
        } else if (currentFamily) {
            const [name, scientificName, birdImageUrl, instagramLink, facebookLink, ebirdLink, birdOfTheWorldLink] = line.split('|');
            if (name) {
                familiesData[currentFamily].birds.push({
                    name: name.trim(),
                    scientificName: scientificName ? scientificName.trim() : '',
                    birdImageUrl: birdImageUrl ? birdImageUrl.trim() : 'https://placehold.co/400x180/CCCCCC/FFFFFF?text=Ave',
                    instagramLink: instagramLink ? instagramLink.trim() : '',
                    facebookLink: facebookLink ? facebookLink.trim() : '',
                    ebirdLink: ebirdLink ? ebirdLink.trim() : '',
                    birdOfTheWorldLink: birdOfTheWorldLink ? birdOfTheWorldLink.trim() : ''
                });
            }
        }
    });

    // 2. Renderizar las familias y sus aves
    const sortedFamilies = Object.keys(familiesData).sort();

    sortedFamilies.forEach(family => {
        const familyInfo = familiesData[family];

        const familySection = document.createElement('div');
        familySection.className = 'mb-4';

        // Botón de cabecera colapsable
        const headerButton = document.createElement('button');
        headerButton.className = 'collapsible-header';
        headerButton.innerHTML = `
            <div class="flex items-center">
                <div class="family-icon-wrapper">
                    <img src="${familyInfo.imageUrl}" alt="Icono de la familia ${family}">
                </div>
                <span class="text-xl md:text-2xl">${family}</span>
            </div>
            <i class="fas fa-chevron-right arrow-icon"></i>
        `;
        familySection.appendChild(headerButton);

        // Contenido colapsable (grid de aves)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'collapsible-content';
        const birdsGrid = document.createElement('div');
        birdsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';

        const sortedBirds = familyInfo.birds.sort((a, b) => a.name.localeCompare(b.name));

        sortedBirds.forEach(bird => {
            const card = document.createElement('div');
            // Uso de la clase unificada 'card-base'
            card.className = 'card-base bg-white rounded-xl shadow-lg border border-gray-100 transform hover:scale-105';
            card.innerHTML = `
                <div class="card-image-container w-full mb-4">
                    <img src="${bird.birdImageUrl}" alt="${bird.name}" class="rounded-t-xl">
                </div>
                <div class="p-6 pt-0 flex-grow flex flex-col items-center text-center">
                    <h2 class="text-xl font-semibold text-gray-800 mb-1">${bird.name}</h2>
                    ${bird.scientificName ? `<p class="text-gray-500 text-sm italic mb-4">${bird.scientificName}</p>` : ''}
                    <div class="flex space-x-4 mt-auto pt-4 border-t border-gray-100 w-full justify-center">
                        ${bird.instagramLink ? `<a href="${bird.instagramLink}" target="_blank" class="social-link text-gray-500 hover:text-pink-600"><i class="fab fa-instagram text-2xl"></i></a>` : ''}
                        ${bird.facebookLink ? `<a href="${bird.facebookLink}" target="_blank" class="social-link text-gray-500 hover:text-blue-700"><i class="fab fa-facebook text-2xl"></i></a>` : ''}
                        ${bird.ebirdLink ? `<a href="${bird.ebirdLink}" target="_blank" class="social-link text-gray-500 hover:text-blue-500"><img src="https://ebird.org/favicon.ico" alt="eBird" class="w-6 h-6 inline-block"></a>` : ''}
                        ${bird.birdOfTheWorldLink ? `<a href="${bird.birdOfTheWorldLink}" target="_blank" class="social-link text-gray-500 hover:text-orange-500"><img src="https://birdsoftheworld.org/favicon.ico" alt="Bird of the World" class="w-6 h-6 inline-block"></a>` : ''}
                    </div>
                </div>
            `;
            birdsGrid.appendChild(card);
        });

        contentDiv.appendChild(birdsGrid);
        familySection.appendChild(contentDiv);
        familiesContainer.appendChild(familySection);

        // 3. Configurar la funcionalidad colapsable
        setupCollapsible(headerButton);
    });
}

document.addEventListener('DOMContentLoaded', loadBirds);