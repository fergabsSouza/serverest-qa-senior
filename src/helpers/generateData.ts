import type { User, AdminFlag } from '../types/user'
import type { ProductInput } from '../types/products'
import { faker } from '@faker-js/faker'

export function makeRandomUser(admin = false): User {
  const r = Math.floor(Math.random() * 1e9)
  const flag: AdminFlag = admin ? 'true' : 'false'
  return {
    nome: `Usuario QA ${r}`,
    email: `qa_${r}@teste.com`,
    password: 'teste',
    administrador: flag,
  }
}

export function makeRandomProduct(overrides: Partial<ProductInput> = {}): ProductInput {
  const base: ProductInput = {
    nome: `Produto ${faker.string.alphanumeric(6)}`,
    preco: faker.number.int({ min: 1, max: 10_000 }),
    descricao: faker.commerce.product(),
    quantidade: faker.number.int({ min: 0, max: 1_000 }),
  }
  return { ...base, ...overrides }
}
