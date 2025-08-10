/// <reference types="cypress" />
import type { User } from '../../src/types/user';
import type { Product } from '../../src/types/products';

const API = Cypress.env('apiUrl') || 'https://serverest.dev';

function authHeader(token: string) {
  return { Authorization: token };
}

Cypress.Commands.add('apiLogin', (email: string, password: string) => {
  return cy.request({
    method: 'POST',
    url: `${API}/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((res) => {
    return res.body?.authorization as string; // ex.: "Bearer xxx"
  });
});

Cypress.Commands.add('apiCreateUser', (user: User) => {
  return cy.request({
    method: 'POST',
    url: `${API}/usuarios`,
    body: user,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiGetUserById', (_id: string) => {
  return cy.request({
    method: 'GET',
    url: `${API}/usuarios/${_id}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiUpdateUser', (_id: string, user: User) => {
  return cy.request({
    method: 'PUT',
    url: `${API}/usuarios/${_id}`,
    body: user,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiDeleteUser', (_id: string) => {
  return cy.request({
    method: 'DELETE',
    url: `${API}/usuarios/${_id}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiCreateProduct', (product: Product, token: string) => {
  return cy.request({
    method: 'POST',
    url: `${API}/produtos`,
    headers: authHeader(token),
    body: product,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiGetProductById', (_id: string) => {
  return cy.request({
    method: 'GET',
    url: `${API}/produtos/${_id}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiUpdateProduct', (_id: string, product: Product, token: string) => {
  return cy.request({
    method: 'PUT',
    url: `${API}/produtos/${_id}`,
    headers: authHeader(token),
    body: product,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('apiDeleteProduct', (_id: string, token: string) => {
  return cy.request({
    method: 'DELETE',
    url: `${API}/produtos/${_id}`,
    headers: authHeader(token),
    failOnStatusCode: false,
  });
});
