import { faker } from '@faker-js/faker'

export function randomAlphaNumId(len = 16): string {
  // gera string alfanumérica com maiúsculas/minúsculas e dígitos
  return faker.string.alphanumeric({ length: len, casing: 'mixed' })
}