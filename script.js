let currentColors = [];
let exportColors = [];

const colorInput = document.getElementById("colorInput");
const preview = document.getElementById("preview");
const harmoniesDiv = document.getElementById("harmonies");

colorInput.addEventListener("input", updateApp);

const hue = document.getElementById("hue");
const saturation = document.getElementById("saturation");
const lightness = document.getElementById("lightness");
const angle = document.getElementById("angle");

hue.addEventListener("input", updateHsl);
saturation.addEventListener("input", updateHsl);
lightness.addEventListener("input", updateHsl);

function updateApp(x) {

 	let selectedColor = ''
	
 	if (typeof(x) == 'object'){
 		selectedColor = colorInput.value;
 	} else {
 		selectedColor = x;
 	}
	
	validateHsl()

	updateColorType(selectedColor);

	let harmonies = getColorHarmonies(selectedColor);

	harmoniesDiv.innerHTML = "";

	harmonies.forEach((harmony) => {
		const harmonyDiv = document.createElement("div");
		harmonyDiv.classList.add("harmony_content");

		const heading = document.createElement("div");
		heading.classList.add("harmony_heading");

		const harmonyTitle = document.createElement("h3");
		harmonyTitle.textContent = harmony.name;
		heading.appendChild(harmonyTitle);

        const harmonyCopyButton = document.createElement("button");
		harmonyCopyButton.textContent = "Kopiuj";
		harmonyCopyButton.classList.add("copyButton");
		harmonyCopyButton.addEventListener("click", () => {
			navigator.clipboard.writeText(harmony.colors.join(", "));
		});

		heading.appendChild(harmonyCopyButton);

		const harmonySystemsColor = document.createElement("button");
		harmonySystemsColor.textContent = "Systemy kolorów";
		harmonySystemsColor.classList.add("systemsButton");
		harmonySystemsColor.addEventListener("click", () => {
            currentColors = harmony.colors;
			popUpSystems();
		});

		heading.appendChild(harmonySystemsColor);

		const harmonyPreviewButton = document.createElement("button");
		harmonyPreviewButton.textContent = "Podgląd";
		harmonyPreviewButton.addEventListener("click", () => {
			preview.style.display = "visible";
			currentColors = harmony.colors;
			previewsRefresh();
		});

		heading.appendChild(harmonyPreviewButton);

		harmonyDiv.appendChild(heading);

		harmony.colors.forEach((color) => {
			const colorBox = document.createElement("div");
			colorBox.classList.add("colorBox");
			colorBox.style.backgroundColor = `hsl( ${color[0]}, ${color[1]}%, ${color[2]}% )`;
			harmonyDiv.appendChild(colorBox);
		});

		harmoniesDiv.appendChild(harmonyDiv);
	});
}

// hsl color harmony calculator
function getColorHarmonies(color) {
	//every h value must be checked because i saw an incidents where it was out of 0-360 range
	const hexToRgb = (hex) => hex.match(/\w\w/g).map((x) => parseInt(x, 16));
	const rgbToHex = (r, g, b) =>
		"#" +
		[r, g, b]
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? "0" + hex : hex;
			})
			.join("");

	let [h, s, l] = htmlToHsl(color); 
	h = huePreCheck(h) 
	const selected_angle = parseFloat(angle?.value) ?? 30;

	const harmonies = [
        {
            name: "Monochromatyczny",
            colors: [
                hslToHtmlHsl([h, s, l]),
            ],
        },
		{
			name: "Analogiczny 🗿",
			colors: [
				hslToHtmlHsl([h, s, l]),
				hslToHtmlHsl([huePreCheck(h + selected_angle), s, l]),
				hslToHtmlHsl([huePreCheck(h - selected_angle), s, l]),
			],
		},
        {
			name: "Analogiczny z dopełnieniem 🗿",
			colors: [
				hslToHtmlHsl([h, s, l]),
				hslToHtmlHsl([huePreCheck(h + selected_angle), s, l]),
				hslToHtmlHsl([huePreCheck(h - selected_angle), s, l]),
                hslToHtmlHsl([huePreCheck(h + 180), s, l]),
			],
		},
		{
			name: "Kontrastowy",
			colors: [
                hslToHtmlHsl([h, s, l]),
                hslToHtmlHsl([huePreCheck(h + 180), s, l])],
		},
        {
            name: "Miękki kontrast 🗿",
            colors: [
                hslToHtmlHsl([h, s, l]), 
                hslToHtmlHsl([huePreCheck(h + (180 + selected_angle)), s, l]),
                hslToHtmlHsl([huePreCheck(h + (180 - selected_angle)), s, l]),
            ],
        },
        {
            name: "Podwójny kontrast 🗿",
            colors: [
                hslToHtmlHsl([h, s, l]),
                hslToHtmlHsl([huePreCheck(h + selected_angle), s, l]),
                hslToHtmlHsl([huePreCheck(h + 180), s, l]),
                hslToHtmlHsl([huePreCheck(h + (180 + selected_angle)), s, l]),
            ],
        },
        {
            name: "Triada 🗿",
            colors: [
                hslToHtmlHsl([h, s, l]),
                hslToHtmlHsl([huePreCheck(h + selected_angle), s, l]),
                hslToHtmlHsl([huePreCheck(h + (180 + selected_angle)), s, l]),
            ],
        },

	];
	return harmonies;
}

/* konwersja typu koloru */

function hslToHtmlHsl(hsl) {
	let h = hsl[0];
	let s = hsl[1];
	let l = hsl[2];
	return [h, s, l];
}

function hslToHtml(hsl) {
	let h = hsl[0] / 360;
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
    console.log(hsl)
	const k = (n) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n) => l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
	return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function hslToHtmlX(hsl) {
    let h = hsl[0] / 360;
    let s = hsl[1] / 100;
    let l = hsl[2] / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    r = Math.round(r * 255).toString(16).padStart(2, '0');
    g = Math.round(g * 255).toString(16).padStart(2, '0');
    b = Math.round(b * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
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
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return [h * 360, s * 100, l * 100];
}

function htmlToRgb(htmlCode) {
	let r = parseInt(htmlCode.substring(1, 3), 16) / 255;
	let g = parseInt(htmlCode.substring(3, 5), 16) / 255;
	let b = parseInt(htmlCode.substring(5, 7), 16) / 255;
	return [r, g, b];
}

function rgbToCmy(rgb) {
	return rgb.map((color) => 1 - color);
}

function rgbToCmyk(rgb) {
	let cmy = rgbToCmy(rgb);
	let k = Math.min(...cmy);
	if (k === 1) return [0, 0, 0, 1];
	return cmy.map((color) => (color - k) / (1 - k)).concat(k);
}

function rgbToXyz(rgb) {
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
	let xyz = rgbToXyz(rgb);

	let whiteX = 95.047;
	let whiteY = 100.0;
	let whiteZ = 108.883;

	let x = xyz[0] / whiteX;
	let y = xyz[1] / whiteY;
	let z = xyz[2] / whiteZ;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

	let l = 116 * y - 16;
	let a = 500 * (x - y);
	let b = 200 * (y - z);

	return [l, a, b];
}

function rgbToLuv(rgb) {
	let xyz = rgbToXyz(rgb);

	let whiteX = 95.047;
	let whiteY = 100.0;
	let whiteZ = 108.883;

	let uprime = (4 * xyz[0]) / (xyz[0] + 15 * xyz[1] + 3 * xyz[2]);
	let vprime = (9 * xyz[1]) / (xyz[0] + 15 * xyz[1] + 3 * xyz[2]);

	let uprime_n = (4 * whiteX) / (whiteX + 15 * whiteY + 3 * whiteZ);
	let vprime_n = (9 * whiteY) / (whiteX + 15 * whiteY + 3 * whiteZ);

	let yr = xyz[1] / 100;
	let l = yr > 0.008856 ? 116 * Math.pow(yr, 1 / 3) - 16 : 903.3 * yr;

	let u = 13 * l * (uprime - uprime_n);
	let v = 13 * l * (vprime - vprime_n);

	return [l, u, v];
}

function rgbToYuv(rgb) {
	let r = rgb[0];
	let g = rgb[1];
	let b = rgb[2];

	let y = 0.299 * r + 0.587 * g + 0.114 * b;
	let u = -0.14713 * r - 0.28886 * g + 0.436 * b;
	let v = 0.615 * r - 0.51499 * g - 0.10001 * b;

	return [y, u, v];
}

function rgbToYiq(rgb) {
	let r = rgb[0];
	let g = rgb[1];
	let b = rgb[2];

	let y = 29.9 * r + 58.7 * g + 11.4 * b;
	let i = 59.6 * r - 27.4 * g - 32.2 * b;
	let q = 21.1 * r - 52.3 * g + 31.2 * b;

	return [y, i, q];
}

function rgbToNcs(rgb) {
	let lab = rgbToLab(rgb);

	let l = lab[0];
	let a = lab[1];
	let b = lab[2];

	let h = Math.atan2(b, a) * 180 / Math.PI;
	if (h < 0) h += 360;
	let c = Math.sqrt(a * a + b * b);
	let s = c / l * 100;
	let n = 100 - s;
  
	let hues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350];
	let hue = hues.reduce((prev, curr) => Math.abs(curr - h) < Math.abs(prev - h) ? curr : prev);
  
	let blacknesses = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
	let blackness = blacknesses.reduce((prev, curr) => Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev);
  
	let chromaticnesses = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
	let chromaticness = chromaticnesses.reduce((prev, curr) => Math.abs(curr - s) < Math.abs(prev - s) ? curr : prev);
  
	return `S${blackness}${chromaticness}-${hue}`;
}

function rgbToRal(rgb) {
	let r = rgb[0];
	let g = rgb[1];
	let b = rgb[2];
}


function rgbToCil(rgb) {
	let r = rgb[0];
	let g = rgb[1];
	let b = rgb[2];


}

function rgbToFreetone(rgb) {
	let r = rgb[0];
	let g = rgb[1];
	let b = rgb[2];

}

function updateColorType(color, prm = "rgb") {
    let rgb, hsl;

    if (prm === "hsl") {    
        color = [color[0]/360, color[1], color[2]];
        console.log(color)
        color = hslToHtmlX([color[0], color[1], color[2]]);
    }
    
    rgb = htmlToRgb(color);
    hsl = htmlToHsl(color);

	let cmy = rgbToCmy(rgb);
	let cmyk = rgbToCmyk(rgb);
	let xyz = rgbToXyz(rgb);
	let lab = rgbToLab(rgb);
	let luv = rgbToLuv(rgb);
	let yuv = rgbToYuv(rgb);
	let yiq = rgbToYiq(rgb);
	let ncs = rgbToNcs(rgb);

    let y =  `
	<div class="clr_system">
	<h3>HSL</h3>
		<p>H: ${hsl[0].toFixed(2)}</p>
		<p>S: ${hsl[1].toFixed(2)}%</p>
		<p>L: ${hsl[2].toFixed(2)}%</p>
	</div>
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
        <h3>CIEXYZ</h3>
        <p>X: ${xyz[0].toFixed(2)}</p>
        <p>Y: ${xyz[1].toFixed(2)}</p>
        <p>Z: ${xyz[2].toFixed(2)}</p>
    </div>
    <div class="clr_system">
        <h3>CIELAB</h3>
        <p>L: ${lab[0].toFixed(2)}</p>
        <p>A: ${lab[1].toFixed(2)}</p>
        <p>B: ${lab[2].toFixed(2)}</p>
    </div>
    <div class="clr_system">
        <h3>CIELUV</h3>
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
	<div class="clr_system">
		<h3>NCS</h3>
		<p>${ncs}</p>
	</div>
    `;

	exportColors.push({'color': {
		'rgb': [rgb[0] * 255, rgb[1] * 255, rgb[2] * 255],
		'hsl': [hsl[0], hsl[1], hsl[2]],
		'cmy': [cmy[0], cmy[1], cmy[2]],
		'cmyk': [cmyk[0], cmyk[1], cmyk[2], cmyk[3]],
		'xyz': [xyz[0], xyz[1], xyz[2]],
		'lab': [lab[0], lab[1], lab[2]],
		'luv': [luv[0], luv[1], luv[2]],
		'yuv': [yuv[0], yuv[1], yuv[2]],
		'yiq': [yiq[0], yiq[1], yiq[2]],
		'ncs': ncs,
	}});

    if (prm === "rgb") {
        x = document.getElementById("clrs");
        x.innerHTML = y;
    } else if (prm === "hsl") {
        x = document.getElementById("popcolors");
        x.innerHTML += `<div><div class="xcolorbox" style="background-color: rgb(${rgb[0] * 255}, ${rgb[1] * 255}, ${rgb[2] * 255})"></div><div class="xrx">` + y + `</div></div>`;
    }

	hue.value = hsl[0];
	saturation.value = hsl[1];
	lightness.value = hsl[2];
}

function updateHsl() {
	let h = hue.value;
	let s = saturation.value;
	let l = lightness.value;
	let x = hslToHtml([h * 360, s, l]);
	colorInput.value = `#${Math.round(x[0]).toString(16)}${Math.round(
		x[1]
	).toString(16)}${Math.round(x[2]).toString(16)}`;
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
	let colors = currentColors;

	const previewColors = [];

	while (previewColors.length < 6) {
		for (const color of colors) {
			previewColors.push(color);
		}
	}

	for (let i = 0; i < 6; i++) {
		document.documentElement.style.setProperty(
			`--color${i + 1}`,
			`hsl(${previewColors[i][0]} ${previewColors[i][1]}% ${previewColors[i][2]}%)`
		);
	}
}

function exportJson() {
	const json = JSON.stringify(exportColors);
	const blob = new Blob([json], { type: "application/json" });
	const a = document.createElement("a");
	a.style.display = "none";
	a.href = window.URL.createObjectURL(blob);
	a.download = "uwukolorki.json";
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(a.href);
	document.body.removeChild(a);
}

function importJson() {
	var input = document.createElement('input');
	input.type = 'file';

	input.onchange = e => { 
		const file = e.target.files[0]; 
		const reader = new FileReader();

		reader.onload = function (event) {
			const jsonString = event.target.result;
			const jsonArray = JSON.parse(jsonString);
			currentColors = jsonArray;
            console.log(currentColors);
			colorInput.value = `#${Math.round(currentColors[0][0]).toString(16)}${Math.round(currentColors[0][1]).toString(16)}${Math.round(currentColors[0][2]).toString(16)}`;
		};
	
		reader.readAsText(file);


	}
	input.click();
}
function switchColorSelector(x) {
	if (x.id == "xxu1") {
		document.getElementsByClassName("c1")[0].style.display = "block";
		document.getElementsByClassName("c2")[0].style.display = "none";
		document.getElementsByClassName("c2")[1].style.display = "none";
	} else {
		document.getElementsByClassName("c1")[0].style.display = "none";
		document.getElementsByClassName("c2")[0].style.display = "flex";
		document.getElementsByClassName("c2")[1].style.display = "block";
	}
}

function buttonChange(x) {
	l = document.getElementById("btl");
	r = document.getElementById("btr");
	if (x === 1) {
		l.style.display = "none";
		r.style.display = "block";
		r.textContent = "Kompozycje";
		r.addEventListener("click", () => {
			switchCard("right");
			buttonChange(2);
		});
	} else if (x === 2) {
		l.style.display = "block";
		l.textContent = "Wybór kolorów";
		l.addEventListener("click", () => {
			switchCard("left");
			buttonChange(1);
		});
		r.style.display = "block";
		r.textContent = "Podglądy";
		r.addEventListener("click", () => {
			if (currentColors.length > 0) {
				document.getElementById('tohide').style.display = "none";
				document.getElementById('toshow').style.display = "block";
			} else {
				document.getElementById('tohide').style.display = "block";
				document.getElementById('toshow').style.display = "none";
			}
			switchCard("preview");
			buttonChange(3);
		});
	} else if (x === 3) {
		l.style.display = "block";
		l.textContent = "Kompozycje";
		l.addEventListener("click", () => {
			switchCard("right");
			buttonChange(2);
		});
		r.style.display = "none";
	}
}

function popUpSystems() {
    let colors = currentColors;
    document.getElementById("popup").style.display = "block";
    const popupContent = document.getElementById("popcolors");
    popupContent.innerHTML = "";
    for (const color in colors) {
        updateColorType([colors[color][0] * 360, colors[color][1], colors[color][2]], "hsl");
    }
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function validateHsl() {
	const h = document.getElementById('hue');
	const s = document.getElementById('saturation');
	const l = document.getElementById('lightness');
	const w = document.getElementById('warning');
	const wx = document.getElementById('warningContent');

	if (s.value < 10) {
		w.style.display = 'block';
		wx.innerHTML = 'Za niska saturacja! Kolory będą bardzo podobne!'
	} else if (l.value < 10) {
		w.style.display = 'block';
		wx.innerHTML = 'Za niska jasność! Kolory będą bardzo podobne!'
	} else if (l.value > 90) {
		w.style.display = 'block';
		wx.innerHTML = 'Za wysoka jasność! Kolory będą bardzo podobne!'
	} else {
		w.style.display = 'none;'
		wx.innerHTML = '';
	}
}

function huePreCheck(h) {
	if (h > 360) {
		h = h - 360;
	} else if (h < 0) {
		h = h + 360;
	}
	return h;
}