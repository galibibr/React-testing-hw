import React from "react";
import { Application } from "../../src/client/Application";
import { it, expect } from "@jest/globals";
import { render } from "@testing-library/react";
// import event from '@testing-library/user-event'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";

describe("App", () => {
  it("Проверяет, что все ссылки в заголовке ведут на правильные страницы", async () => {
    const api = new ExampleApi("/");
    const cart = new CartApi();
    const store = initStore(api, cart);
    const application = (
      <BrowserRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const { getByRole } = render(application);

    const homeLink = getByRole("link", { name: /kogtetochka store/i });
    expect(homeLink.getAttribute("href")).toBe("/");

    const catalogLink = getByRole("link", { name: /catalog/i });
    expect(catalogLink.getAttribute("href")).toBe("/catalog");

    const deliveryLink = getByRole("link", { name: /delivery/i });
    expect(deliveryLink.getAttribute("href")).toBe("/delivery");

    const contactsLink = getByRole("link", { name: /contacts/i });
    expect(contactsLink.getAttribute("href")).toBe("/contacts");

    const cartLink = getByRole("link", { name: /cart/i });
    expect(cartLink.getAttribute("href")).toBe("/cart");
  });
});
