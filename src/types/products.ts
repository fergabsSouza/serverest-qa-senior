export interface ProductInput {
  nome: string
  preco: number
  descricao: string
  quantidade: number
}

export interface Product extends ProductInput {
  _id?: string
}

export interface CreateProductRes {
  message: string
  _id: string
}

export interface UpdateProductRes200 {
  message: string 
}

export interface UpdateProductRes201 {
  message: string 
  _id: string
}

export type UpdateProductRes = UpdateProductRes200 | UpdateProductRes201

export interface DeleteProductRes {
  message: string 
}

export interface ApiMsg {
  message: string
}
