import { apiRequest } from './https'
import type {
  ProductInput,
  Product,
  CreateProductRes,
  UpdateProductRes,
  DeleteProductRes,
} from '@app-types/products'

const BASE = '/produtos'
const auth = (token?: string) =>
  (token ? { Authorization: token } : undefined)

export function create(produto: ProductInput, token?: string) {
  return apiRequest<CreateProductRes>('POST', BASE, produto, auth(token))
}

export function getById(id: string) {
  return apiRequest<Product>('GET', `${BASE}/${id}`)
}

export function update(id: string, produto: ProductInput, token?: string) {
  return apiRequest<UpdateProductRes>('PUT', `${BASE}/${id}`, produto, auth(token))
}

export function remove(id: string, token?: string) {
  return apiRequest<DeleteProductRes>('DELETE', `${BASE}/${id}`, undefined, auth(token))
}
