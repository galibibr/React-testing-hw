import { it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { initStore } from "../../src/client/store";
import { Application } from "../../src/client/Application";
import React from "react";

import { mockApi, mockCart, productsData } from "../mocks/mocks";

const getCheckoutRes = () => {
  return { id: 1 };
};
const store = initStore(mockApi, mockCart);

describe("Catalog", () => {
  const store = initStore(mockApi, mockCart);
  const application = (
    <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );
  const { container } = render(application);
  const productItems = container.getElementsByClassName("ProductItem");

  it("должны отображаться товары из списка, полученного с сервера", async () => {
    expect(container).toMatchSnapshot();
  });

  it("для каждого товара в каталоге отображается название товара", async () => {
    for (let i = 0; i < productItems.length; i++) {
      const div = productItems[i];
      const titleElement = div.querySelector(".ProductItem-Name");
      expect(titleElement).toBeTruthy();
      expect(titleElement?.textContent).toBeTruthy();
    }
  });

  it("должен отображаться цена для каждого товара в каталоге", async () => {
    for (let i = 0; i < productItems.length; i++) {
      const div = productItems[i];
      const priceElement = div.querySelector(".ProductItem-Price");
      expect(priceElement).toBeTruthy();
      expect(priceElement?.textContent).toBeTruthy();
    }
  });

  it("каждый товар в каталоге имеет ссылку на подробности", async () => {
    for (let i = 0; i < productItems.length; i++) {
      const div = productItems[i];
      const link = div.querySelector(".ProductItem-DetailsLink");
      expect(link).toBeTruthy();
      expect(link?.textContent).toBeTruthy();
    }
  });

  it('на странице с товарами отображаются: название, цена, цвет, материал и кнопка "в корзину"', async () => {
    const productItem = productsData[1];
    const store = initStore(mockApi, mockCart);
    const application = (
      <MemoryRouter initialEntries={[`/catalog/${productItem.id}`]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { container, findByText } = render(application);
    const name = await findByText(productItem.name);
    expect(name.textContent).toBeTruthy();
    const price = await findByText(`$${productItem.price}`);
    expect(price.textContent).toBeTruthy();
    const description = container.querySelector(".ProductDetails-Description");
    expect(description).toBeTruthy();
    expect(description?.textContent).toBeTruthy();
    const color = container.querySelector(".ProductDetails-Color");
    expect(color).toBeTruthy();
    expect(color?.textContent).toBeTruthy();
    const material = container.querySelector(".ProductDetails-Material");
    expect(material).toBeTruthy();
    expect(material?.textContent).toBeTruthy();
    const button = container.querySelector(".ProductDetails-AddToCart");
    expect(button).toBeTruthy();
    expect(button?.textContent).toBeTruthy();
  });
});
