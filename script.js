const colorInput = document.getElementById('colorInput');
const harmoniesDiv = document.getElementById('harmonies');

colorInput.addEventListener('input', updateColorHarmonies);

function updateColorHarmonies() {
    const selectedColor = colorInput.value;

    const harmonies = getColorHarmonies(selectedColor);
    
    harmoniesDiv.innerHTML = '';

    harmonies.forEach(harmony => {
        const harmonyDiv = document.createElement('div');
        harmonyDiv.classList.add('harmony_content');

        const harmonyTitle = document.createElement('h3');
        harmonyTitle.textContent = harmony.name;
        harmonyDiv.appendChild(harmonyTitle);

        harmony.colors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.classList.add('colorBox');
            colorBox.style.backgroundColor = color;
            harmonyDiv.appendChild(colorBox);
        });
        
        harmoniesDiv.appendChild(harmonyDiv);
    });
}

function getColorHarmonies(color) {
    // Convert hex color to RGB
    const hexToRgb = (hex) => hex.match(/\w\w/g).map(x => parseInt(x, 16));
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    const [r, g, b] = hexToRgb(color);

    // Harmonies
    const harmonies = [
        {
            name: "Kontrastowy",
            colors: [
                color,
                rgbToHex(r, g, 255 - b)
            ]
        },
        {
            name: "Miękko kontrastowy",
            colors: [
                color,
                rgbToHex(255 - r, g, b),
                rgbToHex(r, g, 255 - b)
            ]
        },
        {
            name: "Podwójny kontrast",
            colors: [
                color,
                rgbToHex(255 - r, 255 - g, b),
                rgbToHex(255 - r, g, 255 - b)
            ]
        },
        {
            name: "Triada",
            colors: [
                color,
                rgbToHex(255 - r, 255 - g, b),
                rgbToHex(r, 255 - g, 255 - b)
            ]
        },
        {
            name: "Tetrada",
            colors: [
                color,
                rgbToHex(255 - r, g, b),
                rgbToHex(r, 255 - g, b),
                rgbToHex(255 - r, 255 - g, 255 - b)
            ]
        },
        {
            name: "Pięciotonowy",
            colors: [
                color,
                rgbToHex(255 - r, g, 255 - b),
                rgbToHex(255 - r, b, 255 - g),
                rgbToHex(r, 255 - g, 255 - b),
                rgbToHex(r, g, 255 - b)
            ]
        },
        {
            name: "Sześciotonowy",
            colors: [
                color,
                rgbToHex(255 - r, g, 255 - b),
                rgbToHex(255 - r, b, 255 - g),
                rgbToHex(r, 255 - g, 255 - b),
                rgbToHex(r, g, 255 - b),
                rgbToHex(r, 255 - b, 255 - g)
            ]
        },
        {
            name: "Siedmiotonowy",
            colors: [
                color,
                rgbToHex(255 - r, g, 255 - b),
                rgbToHex(255 - r, b, 255 - g),
                rgbToHex(r, 255 - g, 255 - b),
                rgbToHex(r, g, 255 - b),
                rgbToHex(r, 255 - b, 255 - g),
                rgbToHex(255 - r, 255 - g, b)
            ]
        },
        {
            name: "Neutralny",
            colors: [
                color,
                rgbToHex(255 - r, 255 - g, 255 - b)
            ]
        },
        {
            name: "Analogiczny",
            colors: [
                color,
                rgbToHex(r, g, 255 - b),
                rgbToHex(r, g, b)
            ]
        }
    ];

    return harmonies;
}