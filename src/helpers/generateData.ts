// src/helpers/generateData.ts
import type { User, AdminFlag } from '../types/user';
import type { Product } from '../types/products';

export function makeRandomUser(admin = false): User {
  const r = Math.floor(Math.random() * 1e9);
  const flag: AdminFlag = admin ? 'true' : 'false';
  return {
    nome: `Usuario QA ${r}`,
    email: `qa_${r}@teste.com`,
    password: 'teste',
    administrador: flag,
  };
}

export function makeRandomProduct(overrides: Partial<Product> = {}): Product {
  const r = Math.floor(Math.random() * 1e9);
  return {
    nome: `Produto QA ${r}`,
    preco: 199,
    descricao: 'Produto de teste QA',
    quantidade: 10,
    ...overrides,
  };
}
