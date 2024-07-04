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


describe('Каталог', () => {
    it('В каталоге для каждого товара отображаются название, цена, ссылка', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(`${baseUrl}${basePath}/catalog`);
        const productItems = await browser.$$('.ProductItem');
        for (let i = 0; i < productItems.length; i++) {
            const productItem = productItems[i];
            const productNameText = await productItem.$('.ProductItem-Name').getText();
            const productPriceText = await productItem.$('.ProductItem-Price').getText();
            const productDetailsLinkText = await productItem.$('.ProductItem-DetailsLink').getText();
            const productDetailsLinkHref = await productItem.$('.ProductItem-DetailsLink').getAttribute('href');
            expect(productNameText).toBeTruthy();
            expect(productPriceText).toBeTruthy();
            expect(productPriceText).toMatch(new RegExp(/\$[0-9]+.*/i));
            expect(productDetailsLinkText).toBeTruthy();
            expect(productDetailsLinkHref).toBeTruthy();
        }
    });

    it('товары из каталога открываются корректно', async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(`${baseUrl}${basePath}/catalog`);
        const productLinks = await browser.$$('.ProductItem a');
        for (let i = 0; i < productLinks.length && i < 3; i++) {
            const productLink = productLinks[i];
            await productLink.click();
            const productDetailsElem = await browser.$('.ProductDetails');
            await browser.waitUntil(async function () {
                return await productDetailsElem.isExisting();
            })
            let isDisplayed = await productDetailsElem.isDisplayed();
            expect(isDisplayed).toBeTruthy();
            await page.goto(`${baseUrl}${basePath}/catalog`)
        }
    });
})