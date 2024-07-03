import React from "react";
import { Application } from "../../src/client/Application";
import { it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
// import event from '@testing-library/user-event'
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";

const basename = "/hw/store";
const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

describe("Application routing", () => {
  it("по адресу / должен отображаться главная страница", () => {
    const application = (
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { getByText } = render(application);
    const title = getByText(/welcome to kogtetochka store!/i);
    expect(title.textContent).toMatch(/welcome to kogtetochka store!/i);
  });

  it('по адресу "/catalog" должен отображаться каталог', () => {
    const application = (
      <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { getByRole } = render(application);
    const title = getByRole("heading", { name: /catalog/i });
    expect(title.textContent).toMatch(/catalog/i);
  });

  it('по адресу "/delivery" должен отображаться доставка', () => {
    const application = (
      <MemoryRouter initialEntries={["/delivery"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { getByRole } = render(application);
    const title = getByRole("heading", { name: /delivery/i });
    expect(title.textContent).toMatch(/delivery/i);
  });

  it('по адресу "/contacts" должен отображаться контакты', () => {
    const application = (
      <MemoryRouter initialEntries={["/contacts"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { getByRole } = render(application);
    const title = getByRole("heading", { name: /contacts/i });
    expect(title.textContent).toMatch(/contacts/i);
  });

  it('по адресу "/cart" должен отображаться корзина', () => {
    const application = (
      <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { getByRole } = render(application);
    const title = getByRole("heading", { name: /shopping cart/i });
    expect(title.textContent).toMatch(/shopping cart/i);
  });
});
