import { localURL } from "./helper/localUrl";

describe('Каталог', () => {

   it('В каталоге для каждого товара отображаются название, цена, ссылка', async ({ browser }) => {
      await browser.url(localURL('/catalog'));
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
})