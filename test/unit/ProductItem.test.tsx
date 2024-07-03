import React from "react";
import { render, screen } from "@testing-library/react";
import { ProductItem } from "../../src/client/components/ProductItem";
import { ProductShortInfo } from "../../src/common/types";
import { it, expect } from "@jest/globals";
// import event from '@testing-library/user-event'
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";

const api = new ExampleApi("/");
const cart = new CartApi();
const store = initStore(api, cart);
const product: ProductShortInfo = {
  id: 1,
  name: "product",
  price: 1,
};

describe("ProductItem component", () => {
  beforeEach(() => {
    const application = (
      <MemoryRouter initialEntries={["/catalog/1"]} initialIndex={0}>
        <Provider store={store}>
          <ProductItem product={product} />
        </Provider>
      </MemoryRouter>
    );

    render(application);
  });

  it("должен отображаться", () => {
    const productItem = screen.getByTestId(product.id);
    // toBeInTheDocument() is not available in jest@26 and earlier, need to use expect(element).toBeInstanceOf(HTMLElement) instead
    expect(productItem).toBeInstanceOf(HTMLElement);
  });

  it("должен отображать название", () => {
    const title = screen.getByRole("heading", { name: /product/i });
    expect(title.textContent).toMatch(/product/i);
  });

  it("должен отображать цену", () => {
    const price = screen.getByText(/\$1/i);
    expect(price.textContent).toMatch(/1/i);
  });

  it('должен отображать ссылку "Details" и вести на правильную страницу', () => {
    const detailsLink = screen.getByRole("link", { name: /details/i });
    expect(detailsLink.getAttribute("href")).toMatch(/catalog\/1$/i);
  });
});
