import { apiRequest } from './https';
import type { Product } from '../types/products';

const auth = (token?: string) => (token ? { Authorization: token } : undefined);

export function create(produto: Product, token?: string) {
  return apiRequest<{ _id: string }>('POST', '/produtos', produto, auth(token));
}

export function getById(id: string) {
  return apiRequest<Product>('GET', `/produtos/${id}`);
}

export function update(id: string, produto: Product, token?: string) {
  return apiRequest<{ message: string; _id?: string }>(
    'PUT',
    `/produtos/${id}`,
    produto,
    auth(token)
  );
}

export function remove(id: string, token?: string) {
  return apiRequest<{ message: string }>('DELETE', `/produtos/${id}`, undefined, auth(token));
}
