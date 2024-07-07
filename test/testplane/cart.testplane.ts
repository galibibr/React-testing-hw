import { localURL } from "./helper/localUrl";

describe('Корзина', () => {
   it("После перезагрузки корзина сохранилась", async ({ browser }) => {
      await browser.url(localURL('/catalog/0'));

      const addCart = await browser.$('.ProductDetails-AddToCart')

      await addCart.waitForDisplayed();
      await addCart.click();

      await browser.refresh();
      await browser.url(localURL('/cart'));

      const count = await browser.$('.Cart-Table .Cart-Count')
      const clearButton = await browser.$('.Cart-Clear')
      await count.waitForDisplayed()

      expect(count).toBeDisplayedInViewport()
      expect(clearButton).toBeDisplayedInViewport()
   });

   it("Проверка формы для заполения", async function ({ browser }) {
      await browser.setWindowSize(1366, 768);

      await browser.url(localURL('/cart'));

      const navBarActive = await browser.$(".navbar-nav > .nav-link.active");
      await navBarActive.waitForExist()

      const navBarActiveText = await navBarActive.getText();
      if (navBarActiveText.includes("(")) {
         const cartClearButton = await browser.$(".Cart-Clear");
         await cartClearButton.waitForExist();
         await cartClearButton.click();
      }

      const catalogItemsMock = await browser.mock("http://localhost:3000/hw/store/api/products");
      await catalogItemsMock.respond('[{"id":0,"name":"kogt1","price":10}, {"id":1,"name":"kogt2","price":20}]');

      const catalogItemMock = await browser.mock("http://localhost:3000/hw/store/api/products/0");
      await catalogItemMock.respond('{"id":0,"name":"kogt1","description":"kogt1Desctiption","price":10,"color":"kogt1Color","material":"kogt1Material"}');

      await browser.url(localURL("/catalog/0"));
      const testItemAddCart = await browser.$(".ProductDetails-AddToCart");
      await testItemAddCart.waitForExist();
      await testItemAddCart.click();

      await browser.url(localURL("/cart"));

      const nameInput = await browser.$(".Form-Field_type_name");
      await nameInput.waitForExist();
      await nameInput.setValue("Test");

      const phoneInput = await browser.$(".Form-Field_type_phone");
      await phoneInput.waitForExist();
      await phoneInput.setValue("+37529123456789");

      const addressInput = await browser.$(".Form-Field_type_address");
      await addressInput.waitForExist();
      await addressInput.setValue("Test address");

      const formButton = await browser.$(".Form-Submit");
      await formButton.waitForExist();
      await formButton.click();

      const success = await browser.$(".alert-success");
      expect(success).toBeDisabled();

      const cartNumber = await browser.$(".Cart-Number");
      await cartNumber.waitForExist();
      expect(await cartNumber.getText()).toEqual("1");
   });

})