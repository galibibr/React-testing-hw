import React from "react";
import { render, screen } from "@testing-library/react";
import { it, expect } from "@jest/globals";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { addToCart, initStore } from "../../src/client/store";
import { CartBadge } from "../../src/client/components/CartBadge";
import { Product } from "../../src/common/types";
import { CartApi, ExampleApi } from "../../src/client/api";

const basename = "/hw/store";

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

describe("CartBadge component", () => {
  it("отображается если продукт в корзине", () => {
    const product: Product = {
      id: 1,
      name: "product name",
      price: 100,
      description: "product description",
      material: "material",
      color: "color",
    };
    store.dispatch(addToCart(product));
    const application = (
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Provider store={store}>
          <CartBadge id={product.id} />
        </Provider>
      </MemoryRouter>
    );

    const { getByText } = render(application);
    expect(getByText(/item in cart/i)).toBeTruthy();
  });

  it("не отображается если продукта нет в корзине", () => {
    const application = (
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Provider store={store}>
          <CartBadge id={2} />
        </Provider>
      </MemoryRouter>
    );
    render(application);
    expect(screen.queryByText(/item in cart/i)).toBeNull();
  });
});
