import { localURL } from "./helper/localUrl";

describe('Страницы главная, условия доставки, контакты должны иметь статическое содержимое', () => {

    afterEach(async ({ browser }) => {
        await browser.assertView('plain', 'body')
    })

    it('Страница главная имеет статическое содержимое', async ({ browser }) => {
        await browser.url(localURL('/'))
    })

    it('Страница условия доставки имеет статическое содержимое', async ({ browser }) => {
        await browser.url(localURL('/delivery'))
    })

    it('Страница контакты имеет статическое содержимое', async ({ browser }) => {
        await browser.url(localURL('/contacts'))
    })

})

describe('Общие требования', () => {
    it('вёрстка должна адаптироваться под ширину экрана', async ({ browser }) => {
        await browser.url(localURL('/'))
        await browser.assertView('desktop', 'body')
        await browser.setWindowSize(575, 1080)
        await browser.assertView('mobile', 'body')
    })

    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async ({ browser }) => {
        await browser.url(localURL('/'))
        await browser.assertView('header', 'body')
    })

    it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async ({ browser }) => {
        await browser.url(localURL('/'))
        await browser.setWindowSize(575, 1080)
        await browser.assertView('burger', 'body')
    })

    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async ({ browser }) => {
        await browser.url(localURL("/"));
        await browser.setWindowSize(575, 800);

        const hamburgerButton = await browser.$(".navbar-toggler");
        expect(hamburgerButton).toExist();

        await hamburgerButton.click();

        const navMenu = await browser.$(".navbar-collapse");
        expect(await navMenu.isDisplayed()).toBe(true);

        const menuItem = await navMenu.$("a[href='/hw/store/catalog']");
        await menuItem.click();

        expect(await navMenu.isDisplayed()).toBe(false);
    });


})
