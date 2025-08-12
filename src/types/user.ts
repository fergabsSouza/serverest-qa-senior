export type AdminFlag = 'true' | 'false'
export interface User {
  nome: string
  email: string
  password: string
  administrador: AdminFlag
  _id?: string
}
