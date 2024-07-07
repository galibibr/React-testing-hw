import { localURL } from "./helper/localUrl";

describe('Каталог', () => {

   it('В каталоге для каждого товара отображаются изображение, название, цена, ссылка', async ({ browser }) => {
      await browser.url(localURL('/catalog'));

      const images = await browser.$$('.Image');
      const names = await browser.$$('.ProductItem-Name');
      const prices = await browser.$$('.ProductItem-Price');
      const links = await browser.$$('.ProductItem-DetailsLink');

      await Promise.all(images.map((image) => expect(image).toBeDisplayed()));
      await Promise.all(names.map((name) => expect(name).toBeDisplayed()));
      await Promise.all(prices.map((price) => expect(price).toBeDisplayed()));
      await Promise.all(links.map((link) => expect(link).toBeDisplayed()));
      await Promise.all(links.map((link) => expect(link.getAttribute('href')).not.toBeUndefined()));
   });

   it('товары из каталога открываются корректно', async ({ browser }) => {
      await browser.url(localURL('/catalog'));
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
         await browser.url(localURL('/catalog'));
      }
   });

   it('товар успешно добавляется в корзину', async ({ browser }) => {
      await browser.url(localURL('/catalog'));

      const detailsLink = await browser.$('.ProductItem-DetailsLink');
      await detailsLink.click();

      const addToCart = await browser.$('.ProductDetails-AddToCart');
      await addToCart.waitForDisplayed();
      await addToCart.click();
      await addToCart.click();

      await browser.url(localURL('/cart'));

      const cartInHeader = await browser.$('[href="/hw/store/cart"]');
      const table = await browser.$('.Cart-Table');

      expect(cartInHeader).toHaveText('Cart (1)');
      expect(table).toBeDisabled();
   })
})