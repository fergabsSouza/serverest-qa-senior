import type { User, AdminFlag } from '../types/user';
import type { Product } from '../types/products';
import { faker } from '@faker-js/faker';

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

export function makeRandomProduct(): Product {
  return {
    nome: `QA ${faker.commerce.productName()} ${faker.string.alphanumeric(6)}`,
    preco: faker.number.int({ min: 10, max: 8000 }),
    descricao: faker.commerce.product(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
  };
}
