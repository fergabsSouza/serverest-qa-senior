/// <reference types="cypress" />

/// <reference types="cypress" />

declare namespace Cypress {
  // usa os aliases do tsconfig
  type User = import('@types/user').User;
  type Product = import('@types/product').Product;

  interface Chainable {
    // Auth
    apiLogin(email: string, password: string): Chainable<string>;

    // Users
    apiCreateUser(user: User): Chainable<Cypress.Response<{ _id: string; message: string }>>;
    apiGetUserById(_id: string): Chainable<Cypress.Response<User>>;
    apiUpdateUser(_id: string, user: User): Chainable<Cypress.Response<{ message: string; _id?: string }>>;
    apiDeleteUser(_id: string): Chainable<Cypress.Response<{ message: string }>>;

    // Products
    apiCreateProduct(product: Product, token: string): Chainable<Cypress.Response<{ _id: string; message: string }>>;
    apiGetProductById(_id: string): Chainable<Cypress.Response<Product>>;
    apiUpdateProduct(_id: string, product: Product, token: string): Chainable<Cypress.Response<{ message: string; _id?: string }>>;
    apiDeleteProduct(_id: string, token: string): Chainable<Cypress.Response<{ message: string }>>;
  }
}

