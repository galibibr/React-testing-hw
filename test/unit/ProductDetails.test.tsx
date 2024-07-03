import React from "react";
import { render, screen } from "@testing-library/react";
import { it, expect } from "@jest/globals";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { initStore } from "../../src/client/store";
import { Product } from "../../src/common/types";
import { CartApi, ExampleApi } from "../../src/client/api";
import { ProductDetails } from "../../src/client/components/ProductDetails";

const basename = "/hw/store";

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

const product: Product = {
  id: 1,
  name: "apple",
  price: 100,
  description: "apple description",
  material: "frozen",
  color: "violet",
};

describe("ProductDetails component", () => {
  beforeEach(() => {
    const application = (
      <MemoryRouter initialEntries={[`/catalog/${product.id}`]} initialIndex={0}>
        <Provider store={store}>
          <ProductDetails product={product} />
        </Provider>
      </MemoryRouter>
    );
    render(application);
  });

  it("отображает имя продукта", () => {
    const title = screen.getByText(product.name);
    expect(title.textContent).toBe(product.name);
  });

  it("отображает цену продукта", () => {
    const price = screen.getByText(/\$100/i);
    expect(price.textContent).toMatch(/\$100/i);
  });

  it("отображает описание продукта", () => {
    const description = screen.getByText(/apple description/i);
    expect(description.textContent).toMatch(/apple description/i);
  });

  it('отображает кнопку "Add to cart"', () => {
    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeTruthy();
  });

  it("отображает материал продукта", () => {
    const material = screen.getByText(/frozen/i);
    expect(material.textContent).toMatch(/frozen/i);
  });

  it("отображает цвет продукта", () => {
    const color = screen.getByText(/violet/i);
    expect(color.textContent).toMatch(/violet/i);
  });
});
