import { faker } from '@faker-js/faker'

export function randomAlphaNumId(len = 16): string {
  return faker.string.alphanumeric({ length: len, casing: 'mixed' })
}