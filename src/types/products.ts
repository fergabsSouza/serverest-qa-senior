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
  message: string // "Registro alterado com sucesso"
}

export interface UpdateProductRes201 {
  message: string // "Cadastro realizado com sucesso"
  _id: string
}

export type UpdateProductRes = UpdateProductRes200 | UpdateProductRes201

export interface DeleteProductRes {
  message: string // "Registro excluído com sucesso | Nenhum registro excluído"
}

// Erros padronizados do swagger
export interface ApiMsg {
  message: string
}
