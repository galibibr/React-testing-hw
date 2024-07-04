import { localURL } from "./helper/localUrl"

describe('Главная страница, Header', () => {

   it('название магазина в шапке должно быть ссылкой на главную страницу', async ({ browser }) => {
      await browser.url(localURL('/'))

      const name = await browser.$('.Application-Brand');
      const nameHref = await name.getAttribute('href');

      expect(nameHref).toBe('/hw/store');
   })

   it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async ({ browser }) => {
      await browser.url(localURL('/'))

      const navLinks = await browser.$$('.nav-link').map(async (link) => Promise.all([
         await link.getText(),
         await link.getAttribute('href'),
      ]))

      expect(navLinks).toEqual([
         ['Catalog', '/hw/store/catalog'],
         ['Delivery', '/hw/store/delivery'],
         ['Contacts', '/hw/store/contacts'],
         ['Cart', '/hw/store/cart'],
      ])
   })
})