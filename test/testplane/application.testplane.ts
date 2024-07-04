
const basePath = '/hw/store';
const baseUrl = 'http://localhost:3000';

const checkTooWide = async (browser, width) => {
    browser.setwindowSize(width, 1000);
    const allElements = await browser.$$('*')
    const widthPromises = allElements.map(element => element.getSize('width'));
    const widths = await Promise.all(widthPromises);
    let tooWide = false;
    for (let i = 0; i < widths.length; i++) {
        if (widths[i] > width) { tooWide = true; break }
    }
    return tooWide
}

describe('Страницы главная, условия доставки, контакты должны иметь статическое содержимое', () => {

    it('Страница главная имеет статическое содержимое', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer()
        const [page] = await puppeteer.pages()
        await page.goto(`${baseUrl}${basePath}/`)
        await browser.assertView('plain', 'body')
    })
})