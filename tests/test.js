import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unlink, readFile } from 'fs/promises';

const testUpdateAppFunction = async (page, hex) => {
    const colorInputValue = await page.evaluate(hex => {
        updateApp(hex);
        return colorInput.value;
    }, hex);

    if (colorInputValue === hex) {
        console.error('[PASSED] Funkcja ustawiła poprawny kolor');
    } else {
        console.log('[FAILED] Funkcja nie ustawiła poprawnego koloru');
    }
}

const testExport = async (page, hex) => {
    await unlink('colors.json').catch(() => null);
    const colorInputValue = await page.evaluate(hex => {
        updateApp(hex);
        return colorInput.value;
    }, hex);

    await page.click('#btr');

    await page.click('.systemsButton:nth-child(3)');

    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(() => {
        exportJson();
    });
    const download = await downloadPromise;

    await download.saveAs('./' + 'colors.json');
    const file = JSON.parse(await readFile('./colors.json', 'utf-8'));

    const resultHex = await page.evaluate((file) => {
        const color = file[0].color.rgb;
        return rgbToHex(color[0], color[1], color[2])
    }, file);

    if(hex === resultHex) {
        console.error('[PASSED] Export działa poprawnie. Plik zapisany poprawnie.');
    } else {
        console.log('[FAILED] Export nie działa poprawnie. Plik zapisany niepoprawnie.');
    }
}

const testImport = async (page) => {
    await page.evaluate(() => {
        importJson();
    })

    const file = JSON.parse(await readFile('./colors.json', 'utf-8'));

    page.on("filechooser", (fileChooser) => {
        fileChooser.setFiles(["./colors.json"]);
    })

    const jsonHex = await page.evaluate((file) => {
        const color = file[0].color.rgb;
        return rgbToHex(color[0], color[1], color[2])
    }, file);

    const importedHex = await page.evaluate(() => {
        return colorInput.value;
    })

    console.log(jsonHex)
    console.log(importedHex)

    if(jsonHex === importedHex) {
        console.error('[PASSED] Import działa poprawnie.');
    } else {
        console.log('[FAILED] Import nie działa poprawnie.');
    }
}

const testHSLInputs = async (page, h, s, l) => {
    await page.fill('#hue', h);
    await page.fill('#saturation', s);
    await page.fill('#lightness', l);

    const fillTest = await page.evaluate(([h, s, l]) => {
        return htmlToHsl(hslToHtmlX([h, s, l]));
    }, [h, s, l]);

    if (fillTest === [h, s, l]) {
        console.error('[PASSED] Wartości inputów zmieniły się poprawnie zgodnie z wartościami HSL. Test zakończony powodzeniem.');
    } else {
        console.log('[FAILED] Wartości inputów nie zmieniły się zgodnie z wartościami HSL. Test zakończony niepowodzeniem.');
    }
}

(async () => {
    const dir = join(dirname(fileURLToPath(import.meta.url)), '../index.html')

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`file:///${dir}/../index.html`);

    await testUpdateAppFunction(page, '#ff0000');
    await testHSLInputs(page, '349', '50', '88');
    await testExport(page, '#ff12d2');
    await testImport(page);

    await browser.close();
})();
