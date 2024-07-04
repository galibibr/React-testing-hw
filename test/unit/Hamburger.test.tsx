import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import events from "@testing-library/user-event";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Application } from "../../src/client/Application";
import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";

describe("Гамбургер", () => {
  window.innerWidth = 500;

  const basename = "/";

  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);

  const application = (
    <MemoryRouter initialEntries={["/"]} initialIndex={0}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );

  it("отображается при ширине окна <= 576px", () => {
    const { container } = render(application);

    const hamburger = container.querySelector(".Application-Toggler");

    expect(hamburger).toBeVisible();
  });

  it("отображает меню после клика", async () => {
    const { container } = render(application);

    const hamburger = container.querySelector(".Application-Toggler") as HTMLButtonElement;
    const menu = container.querySelector(".Application-Menu") as HTMLDivElement;

    expect(menu).toHaveClass("collapse");
    await events.click(hamburger);
    expect(menu).not.toHaveClass("collapse");
    await events.click(hamburger);
    expect(menu).toHaveClass("collapse");
  });
});
