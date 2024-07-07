import { localURL } from "./helper/localUrl"

describe('Продукт отбражается корректно со всеми свойствами', () => {

   beforeEach(async ({ browser }) => {
      await browser.url(localURL('/hw/store/catalog/1'))
      await browser.assertView('plain', 'body')
   })

})