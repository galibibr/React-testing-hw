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

describe("проверка корректности данных формы заказа", () => {
  const cart = {
    "1": { name: "Rustic Chicken", count: 1, price: 242 },
    "5": { name: "Intelligent Chair", count: 1, price: 857 },
    "14": { name: "Fantastic Towels", count: 1, price: 976 },
  };
  it("нет ошибок при корректных данных формы заказа", async () => {
    mockCart.setState(cart);
    const store = initStore(mockApi, mockCart);
    const application = (
      <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { container, getByLabelText, getByText } = render(application);
    const nameInput = getByLabelText("Name") as HTMLInputElement;
    const phoneInput = getByLabelText("Phone") as HTMLInputElement;
    const addressInput = getByLabelText("Address") as HTMLTextAreaElement;
    const checkoutBtn = container.getElementsByClassName("Form-Submit")[0];
    expect(checkoutBtn).toBeTruthy();
    await userEvent.type(nameInput, "Username");
    await userEvent.type(phoneInput, "1234567890");
    await userEvent.type(addressInput, "NewYork");
    await userEvent.click(checkoutBtn as HTMLElement);
    expect(nameInput.classList.contains("is-invalid")).toBeFalsy();
    expect(phoneInput.classList.contains("is-invalid")).toBeFalsy();
    expect(addressInput.classList.contains("is-invalid")).toBeFalsy();
  });

  it("ошибка если нет имени", async () => {
    mockCart.setState(cart);
    const store = initStore(mockApi, mockCart);
    const application = (
      <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { container, getByLabelText, findByText } = render(application);
    const phoneInput = getByLabelText("Phone") as HTMLInputElement;
    const addressInput = getByLabelText("Address") as HTMLTextAreaElement;
    const checkoutBtn = container.getElementsByClassName("Form-Submit")[0];
    expect(checkoutBtn).toBeTruthy();
    await userEvent.type(phoneInput, "1234567890");
    await userEvent.type(addressInput, "NewYork");
    await userEvent.click(checkoutBtn as HTMLElement);
    const errorMessage = await findByText("Please provide your name");
    expect(errorMessage).toBeTruthy();
  });

  it("ошибка если нет адреса", async () => {
    mockCart.setState(cart);
    const store = initStore(mockApi, mockCart);
    const application = (
      <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { container, getByLabelText, findByText } = render(application);
    const nameInput = getByLabelText("Name") as HTMLInputElement;
    const phoneInput = getByLabelText("Phone") as HTMLInputElement;
    const checkoutBtn = container.getElementsByClassName("Form-Submit")[0];
    expect(checkoutBtn).toBeTruthy();
    await userEvent.type(nameInput, "User");
    await userEvent.type(phoneInput, "1234567890");
    await userEvent.click(checkoutBtn as HTMLElement);
    const errorMessage = await findByText("Please provide a valid address");
    expect(errorMessage).toBeTruthy();
  });

  it("ошибка если нет номер телефона", async () => {
    mockCart.setState(cart);
    const store = initStore(mockApi, mockCart);
    const application = (
      <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { container, getByLabelText, findByText } = render(application);
    const nameInput = getByLabelText("Name") as HTMLInputElement;
    const addressInput = getByLabelText("Address") as HTMLTextAreaElement;
    const checkoutBtn = container.getElementsByClassName("Form-Submit")[0];
    expect(checkoutBtn).toBeTruthy();
    await userEvent.type(nameInput, "User");
    await userEvent.type(addressInput, "NewYork");
    await userEvent.click(checkoutBtn as HTMLElement);
    const errorMessage = await findByText("Please provide a valid phone");
    expect(errorMessage).toBeTruthy();
  });

  it("ошибка если неверный номер телефона", async () => {
    mockCart.setState(cart);
    const store = initStore(mockApi, mockCart);
    const application = (
      <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { container, getByLabelText, findByText } = render(application);
    const nameInput = getByLabelText("Name") as HTMLInputElement;
    const phoneInput = getByLabelText("Phone") as HTMLInputElement;
    const addressInput = getByLabelText("Address") as HTMLTextAreaElement;
    const checkoutBtn = container.getElementsByClassName("Form-Submit")[0];
    expect(checkoutBtn).toBeTruthy();
    await userEvent.type(nameInput, "User");
    await userEvent.type(phoneInput, "12345ds3232");
    await userEvent.type(addressInput, "NewYork");
    await userEvent.click(checkoutBtn as HTMLElement);
    const errorMessage = await findByText("Please provide a valid phone");
    expect(errorMessage).toBeTruthy();
  });
});
