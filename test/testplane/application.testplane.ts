
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
    const basePath = '/hw/store';
    const baseUrl = 'http://localhost:3000';

    it('Страница главная имеет статическое содержимое', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer()
        const [page] = await puppeteer.pages()
        await page.goto(`${baseUrl}${basePath}/`)
        await browser.assertView('plain', 'body')
    })

    it('Страница условия доставки имеет статическое содержимое', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer()
        const [page] = await puppeteer.pages()
        await page.goto(`${baseUrl}${basePath}/delivery`)
        await browser.assertView('plain', 'body')
    })

    it('Страница контакты имеет статическое содержимое', async ({ browser }) => {
        const puppettere = await browser.getPuppeteer()
        const [page] = await puppettere.pages()
        await page.goto(`${baseUrl}${basePath}/contacts`)
        await browser.assertView('plain', 'body')
    })
})

