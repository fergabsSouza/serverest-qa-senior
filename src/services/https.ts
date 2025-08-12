export const API = Cypress.env('apiUrl')

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type ReqBody = Cypress.RequestBody

export function apiRequest<TRes = unknown, TReq extends ReqBody = ReqBody>(
  method: Method,
  path: string,
  body?: TReq,
  headers?: Readonly<Record<string, string>>
): Cypress.Chainable<Cypress.Response<TRes>> {
  const url = `${API}${path.startsWith('/') ? '' : '/'}${path}`
  return cy.request<TRes>({
    method,
    url,
    body,
    headers,
    failOnStatusCode: false,
  })
}
