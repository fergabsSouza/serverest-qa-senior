// src/services/http.ts  (ou https.ts, se preferir — só alinhe os imports)
export const API = Cypress.env('apiUrl')

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Corpo aceito pelo cy.request (string | object | ArrayBuffer | Blob | FormData)
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
