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

