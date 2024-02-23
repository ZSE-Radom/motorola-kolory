let currentColors = [];

const colorInput = document.getElementById('colorInput');
const preview = document.getElementById('preview');
const harmoniesDiv = document.getElementById('harmonies');

colorInput.addEventListener('input', updateApp);

const hue = document.getElementById('hue');
const saturation = document.getElementById('saturation');
const lightness = document.getElementById('lightness');

hue.addEventListener('input', updateHsl);
saturation.addEventListener('input', updateHsl);
lightness.addEventListener('input', updateHsl);

function updateApp() {
    const selectedColor = colorInput.value;

    updateColorType(selectedColor);

    const harmonies = getColorHarmonies(selectedColor);
    
    harmoniesDiv.innerHTML = '';

    harmonies.forEach(harmony => {
        const harmonyDiv = document.createElement('div');
        harmonyDiv.classList.add('harmony_content');

        const heading = document.createElement('div');
        heading.classList.add('harmony_heading');

        const harmonyTitle = document.createElement('h3');
        harmonyTitle.textContent = harmony.name;
        heading.appendChild(harmonyTitle);

        const harmonyCopyButton = document.createElement('button');
        harmonyCopyButton.textContent = 'Kopiuj';
        harmonyCopyButton.classList.add('copyButton');
        harmonyCopyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(harmony.colors.join(', '));
        });

        heading.appendChild(harmonyCopyButton);

        const harmonyPreviewButton = document.createElement('button');
        harmonyPreviewButton.textContent = 'Podgląd';
        harmonyPreviewButton.addEventListener('click', () => {
            preview.style.display = 'visible';
            currentColors = harmony.colors;
            previewsRefresh();
        });

        heading.appendChild(harmonyPreviewButton);

        harmonyDiv.appendChild(heading);

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
    // z dupy to te kolory bierze a nie liczy
    const hexToRgb = (hex) => hex.match(/\w\w/g).map(x => parseInt(x, 16));
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    const [r, g, b] = hexToRgb(color);

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

/* konwersja typu koloru */

function hslToHtml(hsl) {
    let h = hsl[0];
    let s = hsl[1];
    let l = hsl[2];
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
}

function htmlToHsl(htmlCode) {
    let r = parseInt(htmlCode.substring(1, 3), 16) / 255;
    let g = parseInt(htmlCode.substring(3, 5), 16) / 255;
    let b = parseInt(htmlCode.substring(5, 7), 16) / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h = (max + min) / 2;
    let s = (max + min) / 2;
    let l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    }
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function htmlToRgb(htmlCode) {
    let r = parseInt(htmlCode.substring(1, 3), 16) / 255;
    let g = parseInt(htmlCode.substring(3, 5), 16) / 255;
    let b = parseInt(htmlCode.substring(5, 7), 16) / 255;
    return [r, g, b];
}

function rgbToCmy(rgb) {
    // działa poprawnie (chyba)
    return rgb.map(color => 1 - color);
}

function rgbToCmyk(rgb) {
    // działa poprawnie (chyba)
    let cmy = rgbToCmy(rgb);
    let k = Math.min(...cmy);
    if (k === 1) return [0, 0, 0, 1];
    return cmy.map(color => (color - k) / (1 - k)).concat(k);
}

function rgbToXyz(rgb) {
    // nie działa poprawnie (chyba)
    let r = rgb[0];
    let g = rgb[1];
    let b = rgb[2];

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    r *= 100;
    g *= 100;
    b *= 100;

    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    return [x, y, z];
}

function rgbToLab(rgb) {
    // stestowane i o dziwo działa poprawnie (chyba)
    let xyz = rgbToXyz(rgb);

    let whiteX = 95.047;
    let whiteY = 100.0;
    let whiteZ = 108.883;

    let x = xyz[0] / whiteX;
    let y = xyz[1] / whiteY;
    let z = xyz[2] / whiteZ;

    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16/116);
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16/116);
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16/116);

    let l = (116 * y) - 16;
    let a = 500 * (x - y);
    let b = 200 * (y - z);

    return [l, a, b];
}

function rgbToLuv(rgb) {
    // jako tako działa (chyba)
    let xyz = rgbToXyz(rgb);

    let whiteX = 95.047;
    let whiteY = 100.0;
    let whiteZ = 108.883;

    let uprime = 4 * xyz[0] / (xyz[0] + 15 * xyz[1] + 3 * xyz[2]);
    let vprime = 9 * xyz[1] / (xyz[0] + 15 * xyz[1] + 3 * xyz[2]);

    let uprime_n = 4 * whiteX / (whiteX + 15 * whiteY + 3 * whiteZ);
    let vprime_n = 9 * whiteY / (whiteX + 15 * whiteY + 3 * whiteZ);

    let yr = xyz[1] / 100;
    let l = yr > 0.008856 ? 116 * Math.pow(yr, 1/3) - 16 : 903.3 * yr;

    let u = 13 * l * (uprime - uprime_n);
    let v = 13 * l * (vprime - vprime_n);

    return [l, u, v];
}

function rgbToYuv(rgb) {
    // nie działa poprawnie (chyba)
    let r = rgb[0];
    let g = rgb[1];
    let b = rgb[2];

    let y = 0.299 * r + 0.587 * g + 0.114 * b;
    let u = -0.14713 * r - 0.28886 * g + 0.436 * b;
    let v = 0.615 * r - 0.51499 * g - 0.10001 * b;

    return [y, u, v];
}

function rgbToYiq(rgb) {
    // za ciemne
    let r = rgb[0];
    let g = rgb[1];
    let b = rgb[2];

    let y = 29.9 * r + 58.7 * g + 11.4 * b;
    let i = 59.6 * r - 27.4 * g - 32.2 * b;
    let q = 21.1 * r - 52.3 * g + 31.2 * b;

    return [y, i, q];
}

function updateColorType(color) {
    let rgb = htmlToRgb(color);
    let hsl = htmlToHsl(color);
    let cmy = rgbToCmy(rgb);
    let cmyk = rgbToCmyk(rgb);
    let xyz = rgbToXyz(rgb);
    let lab = rgbToLab(rgb);
    let luv = rgbToLuv(rgb);
    let yuv = rgbToYuv(rgb);
    let yiq = rgbToYiq(rgb);
    let x = document.getElementById("clrs");
    x.innerHTML = `
    <div class="clr_system">
        <h3>RGB</h3>
        <p>R: ${rgb[0] * 255}</p>
        <p>G: ${rgb[1] * 255}</p>
        <p>B: ${rgb[2] * 255}</p>
    </div>
    <div class="clr_system">
        <h3>CMY</h3>
        <p>C: ${(cmy[0] * 100).toFixed(2)}%</p>
        <p>M: ${(cmy[1] * 100).toFixed(2)}%</p>
        <p>Y: ${(cmy[2] * 100).toFixed(2)}%</p>
    </div>
    <div class="clr_system">
        <h3>CMYK</h3>
        <p>C: ${(cmyk[0] * 100).toFixed(2)}%</p>
        <p>M: ${(cmyk[1] * 100).toFixed(2)}%</p>
        <p>Y: ${(cmyk[2] * 100).toFixed(2)}%</p>
        <p>K: ${(cmyk[3] * 100).toFixed(2)}%</p>
    </div>
    <div class="clr_system">
        <h3>XYZ</h3>
        <p>X: ${xyz[0].toFixed(2)}</p>
        <p>Y: ${xyz[1].toFixed(2)}</p>
        <p>Z: ${xyz[2].toFixed(2)}</p>
    </div>
    <div class="clr_system">
        <h3>LAB</h3>
        <p>L: ${lab[0].toFixed(2)}</p>
        <p>A: ${lab[1].toFixed(2)}</p>
        <p>B: ${lab[2].toFixed(2)}</p>
    </div>
    <div class="clr_system">
        <h3>LUV</h3>
        <p>L: ${luv[0].toFixed(2)}</p>
        <p>U: ${luv[1].toFixed(2)}</p>
        <p>V: ${luv[2].toFixed(2)}</p>
    </div>
    <div class="clr_system">
        <h3>YUV</h3>
        <p>Y: ${yuv[0].toFixed(2)}</p>
        <p>U: ${yuv[1].toFixed(2)}</p>
        <p>V: ${yuv[2].toFixed(2)}</p>
    </div>
    <div class="clr_system">
        <h3>YIQ</h3>
        <p>Y: ${yiq[0].toFixed(2)}</p>
        <p>I: ${yiq[1].toFixed(2)}</p>
        <p>Q: ${yiq[2].toFixed(2)}</p>
    </div>
    `

    hue.value = hsl[0] * 360;
    saturation.value = hsl[1] * 100;
    lightness.value = hsl[2] * 100;
}

function updateHsl() {
    let h = hue.value;
    let s = saturation.value;
    let l = lightness.value;
    let x = hslToHtml([h, s/100, l/100]);
    colorInput.value = `#${Math.round(x[0]).toString(16)}${Math.round(x[1]).toString(16)}${Math.round(x[2]).toString(16)}`
    updateApp();
}

function switchCard(t) {
    var x = document.getElementsByClassName("card");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(t).style.display = "block";
}

function previewsRefresh() {
    //currentColors zawiera kolory które mamy sprawdzać, kolorów ma być 6 jak jest mniej to zapętlamy kolory w tablicy
    let root = document.documentElement;
    let colors = currentColors;

    if (colors.length < 6) {
        let i = 0;
        while (colors.length < 6) {
            colors.push(colors[i]);
            i++;
        }
    }

    for (let i = 0; i < 6; i++) {
        root.style.setProperty(`--color${i + 1}`, colors[i]);
    }

    const vectorIcons = document.getElementById('vectorIcons');
    for (let i = 0; i < vectorIcons.children.length; i++) {
        vectorIcons.children[i].style.backgroundColor = currentColors[i];
    }
}

function exportJson() {
    const json = JSON.stringify(currentColors);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = window.URL.createObjectURL(blob);
    a.download = 'uwukolorki.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}

function importJson() {
    /*   do wrzucenia w html
         <input type="file" id="fileInput" accept=".json">
         <button onclick="loadJson()">wczytaj</button>
         Naprawdę to wrzucę przysięgam
    */
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const jsonString = event.target.result;
      const jsonArray = JSON.parse(jsonString);
      currentColors = jsonArray;
    };

    reader.readAsText(file);
    
}

function switchColorSelector(x) {
    if (x.id == 'xxu1') {
        document.getElementsByClassName('c1')[0].style.display = 'block';
        document.getElementsByClassName('c2')[0].style.display = 'none';
    } else {
        document.getElementsByClassName('c1')[0].style.display = 'none';
        document.getElementsByClassName('c2')[0].style.display = 'block';
    }
}

function buttonChange(x) {
    l = document.getElementById('btl');
    r = document.getElementById('btr');
    if (x === 1) {
        l.style.display = 'none';
        r.style.display = 'block';
        r.textContent = 'Kompozycje';
        r.addEventListener('click', () => {
            switchCard('right'); 
            buttonChange(2);
        });
    } else if (x === 2) {
        l.style.display = 'block';
        l.textContent = 'Wybór kolorów';
        l.addEventListener('click', () => {
            switchCard('left'); 
            buttonChange(1);
        });
        r.style.display = 'block';
        r.textContent = 'Podglądy';
        r.addEventListener('click', () => {
            switchCard('preview'); 
            buttonChange(3);
        });
    } else if (x === 3) {
        l.style.display = 'block';
        l.textContent = 'Kompozycje';
        l.addEventListener('click', () => {
            switchCard('right'); 
            buttonChange(2);
        });
        r.style.display = 'none';
    }
}