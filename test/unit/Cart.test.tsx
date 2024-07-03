import { it, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { initStore } from "../../src/client/store";
import { Application } from "../../src/client/Application";

import React from "react";
import userEvent from "@testing-library/user-event";

import { mockApi, mockCart, productsData } from "../mocks/mocks";

const getCheckoutRes = () => {
  return { id: 1 };
};
const store = initStore(mockApi, mockCart);

describe("Cart", () => {
  const creareApplication = () => {
    const store = initStore(mockApi, mockCart);
    return (
      <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
  };
  it("корзина должна содержать таблицу с добавленными товарами", async () => {
    let cart = {
      "1": { name: "Rustic Chicken", count: 1, price: 242 },
      "5": { name: "Intelligent Chair", count: 1, price: 857 },
      "14": { name: "Fantastic Towels", count: 1, price: 976 },
    };
    mockCart.setState(cart);
    const application = creareApplication();
    const { container } = render(application);
    const cartTable = container.querySelector(".Cart-Table");
    const rows = cartTable?.getElementsByClassName("Cart-Index");
    expect(rows?.length).toBe(Object.keys(cart).length);
  });

  it('корзина должна содержать кнопку "очистить корзину", по нажатию на которую все товары должны удалиться', async () => {
    const cart = {
      "1": { name: "Rustic Chicken", count: 1, price: 242 },
      "5": { name: "Intelligent Chair", count: 1, price: 857 },
      "14": { name: "Fantastic Towels", count: 1, price: 976 },
    };
    await mockCart.setState(cart);
    const application = creareApplication();

    const { container } = render(application);
    const cartClear = container.getElementsByClassName("Cart-Clear")[0];
    expect(cartClear).toBeTruthy();
    await userEvent.click(cartClear as HTMLElement);
    const cartTable = container.querySelector(".Cart-Table");
    expect(cartTable).toBeNull();
    const cartState = await mockCart.getState();
    expect(Object.keys(cartState).length).toBeFalsy();
  });

  it("при успешном оформлении заказа, должен появиться текст Success!", async () => {
    const cart = {
      "1": { name: "Rustic Chicken", count: 1, price: 242 },
      "5": { name: "Intelligent Chair", count: 1, price: 857 },
      "14": { name: "Fantastic Towels", count: 1, price: 976 },
    };
    await mockCart.setState(cart);
    const application = creareApplication();

    const { container, getByLabelText, findByText } = render(application);
    const nameInput = getByLabelText("Name");
    const phoneInput = getByLabelText("Phone");
    const addressInput = getByLabelText("Address");
    const checkoutBtn = container.getElementsByClassName("Form-Submit")[0];
    expect(checkoutBtn).toBeTruthy();
    await userEvent.type(nameInput, "User");
    await userEvent.type(phoneInput, "1234567890");
    await userEvent.type(addressInput, "NewYork");
    await userEvent.click(checkoutBtn as HTMLElement);
    const wellDoneMessage = await findByText("Well done!");
    expect(wellDoneMessage).toBeTruthy();
  });

  it("Отображается сообщение об успешном оформлении заказа в цвете успеха", async () => {
    const cart = {
      "1": { name: "Rustic Chicken", count: 1, price: 242 },
      "5": { name: "Intelligent Chair", count: 1, price: 857 },
      "14": { name: "Fantastic Towels", count: 1, price: 976 },
    };
    await mockCart.setState(cart);
    const application = creareApplication();

    const { container, getByLabelText, findByText } = render(application);
    const nameInput = getByLabelText("Name");
    const phoneInput = getByLabelText("Phone");
    const addressInput = getByLabelText("Address");
    const checkoutBtn = container.getElementsByClassName("Form-Submit")[0];
    expect(checkoutBtn).toBeTruthy();
    await userEvent.type(nameInput, "User");
    await userEvent.type(phoneInput, "1234567890");
    await userEvent.type(addressInput, "NewYork");
    await userEvent.click(checkoutBtn as HTMLElement);
    await findByText("Well done!");
    const messageBox = container.querySelector(".Cart-SuccessMessage");
    expect(messageBox?.classList.contains("alert-success")).toBeTruthy();
  });

  it("Отображаются данные каждого товара в корзине, а также общая сумма заказа", async () => {
    let cart = {
      "1": { name: "Rustic Chicken", count: 1, price: 242 },
      "5": { name: "Intelligent Chair", count: 1, price: 857 },
      "14": { name: "Fantastic Towels", count: 1, price: 976 },
    };
    mockCart.setState(cart);
    const application = creareApplication();

    const { container, getByTestId } = render(application);
    Object.entries(cart).forEach(([id, item], index) => {
      const row = getByTestId(id);
      const cartIndex = row.querySelector(".Cart-Index")?.textContent;
      const cartName = row.querySelector(".Cart-Name")?.textContent;
      const cartPrice = row.querySelector(".Cart-Price")?.textContent;
      const cartCount = row.querySelector(".Cart-Count")?.textContent;
      const cartTotal = row.querySelector(".Cart-Total")?.textContent;
      expect(cartIndex).toBe((index + 1).toString());
      expect(cartName).toBe(item.name);
      expect(cartPrice).toContain(item.price.toString());
      expect(cartCount).toContain(item.count.toString());
      expect(cartTotal).toContain((item.count * item.price).toString());
    });
    const cartOrderPrice = container.getElementsByClassName("Cart-OrderPrice")[0];
    expect(cartOrderPrice).toBeTruthy();
  });

  it("в шапке отображается количество уникальных товаров в корзине", async () => {
    let cart = {
      "1": { name: "Rustic Chicken", count: 1, price: 242 },
      "5": { name: "Intelligent Chair", count: 1, price: 857 },
      "14": { name: "Fantastic Towels", count: 1, price: 976 },
    };
    mockCart.setState(cart);
    const application = creareApplication();

    const { getByText } = render(application);
    const catalogName = getByText(/Cart \([0-9]+\)/i) as HTMLLinkElement;
    expect(catalogName.textContent).toContain(Object.keys(cart).length.toString());
  });

  it("если корзина пуста, отображается ссылка на каталог товаров", async () => {
    let cart = {};
    mockCart.setState(cart);
    const store = initStore(mockApi, mockCart);
    const application = creareApplication();

    const { getByText } = render(application);
    const catalogName = getByText("catalog") as HTMLLinkElement;
    expect(catalogName.href).toContain("/catalog");
  });

  it("отображается сообщение об уже добавленном товаре в каталоге и на странице товара", async () => {
    const productItem = productsData[1];
    const store = initStore(mockApi, mockCart);
    const application = (
      <MemoryRouter initialEntries={[`/catalog/${productItem.id}`]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { findByText, findByRole } = render(application);

    const AddToCartBtn = await findByRole("button", { name: "Add to Cart" });
    await userEvent.click(AddToCartBtn);
    const inCartMessageElement = await findByText("Item in cart");
    expect(inCartMessageElement).toBeTruthy();
  });

  it("Кнопка добавления в корзину имеет размер большой", async () => {
    const productItem = productsData[1];
    const store = initStore(mockApi, mockCart);
    const application = (
      <MemoryRouter initialEntries={[`/catalog/${productItem.id}`]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { findByRole } = render(application);
    const AddToCartBtn = await findByRole("button", { name: "Add to Cart" });
    expect(AddToCartBtn.classList.contains("btn-lg")).toBeTruthy();
  });
});
