import { apiRequest } from './https';

export function login(email: string, password: string) {
  return apiRequest<{ authorization: string }>('POST', '/login', { email, password });
}

export function getToken(email: string, password: string) {
  return login(email, password).then((r) => {
    expect([200, 401]).to.include(r.status);
    return r.status === 200 ? (r.body.authorization as string) : '';
  });
}