/// <reference types="cypress" />

declare namespace Cypress {
  // Tipos do projeto (via tsconfig paths)
  type User = import('@types/user').User;
  type Product = import('@types/products').Product;

  interface Chainable {
    // Auth
    apiLogin(email: string, password: string): Chainable<string>;

    // Users
    apiCreateUser(user: User): Chainable<Cypress.Response<{ _id: string; message: string }>>;
    apiGetUserById(_id: string): Chainable<Cypress.Response<User | { message: string }>>; // 200 ou 400
    apiUpdateUser(_id: string, user: User): Chainable<Cypress.Response<{ message: string; _id?: string }>>;
    apiDeleteUser(_id: string): Chainable<Cypress.Response<{ message: string }>>;

    // Products
    apiCreateProduct(product: Product, token: string): Chainable<Cypress.Response<{ _id: string; message: string }>>;
    apiGetProductById(_id: string): Chainable<Cypress.Response<Product | { message: string }>>;
    apiUpdateProduct(_id: string, product: Product, token: string): Chainable<Cypress.Response<{ message: string; _id?: string }>>;
    apiDeleteProduct(_id: string, token: string): Chainable<Cypress.Response<{ message: string }>>;

    // UI
    uiLogin(email: string, password: string): Chainable<void>;
    uiLogout(): Chainable<void>;
    uiAssertLoggedIn(): Chainable<void>;
  }
}