import { apiRequest } from './https';
import { makeRandomUser } from '../helpers/generateData';
import type { User } from '../types/user';
import { getToken } from './authService';

export function create(user: User) {
  return apiRequest<{ _id: string }>('POST', '/usuarios', user);
}

export function getById(id: string) {
  return apiRequest('GET', `/usuarios/${id}`);
}

export function update(id: string, user: User) {
  return apiRequest('PUT', `/usuarios/${id}`, user);
}

export function remove(id: string) {
  return apiRequest('DELETE', `/usuarios/${id}`);
}

/** Cria usuário e (se possível) retorna token — ideal para seed de UI */
export function seedUser(admin = false) {
  const user = makeRandomUser(admin);
  let _id = '';
  return create(user)
    .then((res) => {
      expect(res.status).to.eq(201);
      _id = res.body._id;
      return getToken(user.email, user.password);
    })
    .then((token) => ({ _id, user, token }));
}
