import * as Users from '@services/userService'
import * as Auth from '@services/authService'
import * as Products from '@services/productService'
import type { AdminCtx } from '@app-types/auth'

import { makeRandomUser, makeRandomProduct } from '@helpers/generateData'
import { expectErrorContains } from '@helpers/assertions'

describe('API - Produtos (E2E + cenários de falha)', () => {
  const admin: AdminCtx = { email: '', password: '', id: '', token: '' }
  const createdProductIds: string[] = []
  const createdUserIds: string[] = []

  before(() => {
    const u = makeRandomUser(true)
    admin.email = u.email
    admin.password = u.password

    return Users.create(u)
      .then((r) => {
        expect(r.status).to.eq(201)
        admin.id = r.body._id
        createdUserIds.push(admin.id)
        return Auth.login(admin.email, admin.password)
      })
      .then((r) => {
        expect(r.status).to.eq(200)
        admin.token = r.body.authorization
      })
  })

  afterEach(() => {
    const delAll = createdProductIds.map((pid) => Products.remove(pid, admin.token))
    createdProductIds.length = 0
    return Cypress.Promise.all(delAll)
  })

  after(() => {
    if (admin.id) {
      return Users.remove(admin.id)
    }
  })

  it('E2E: criar → buscar → editar → excluir (e validar 400 após exclusão)', () => {
    const p = makeRandomProduct()
    let id = ''

    Products.create(p, admin.token)
      .then((rCreate) => {
        expect(rCreate.status).to.eq(201)
        id = rCreate.body._id
        createdProductIds.push(id)

        return Products.getById(id)
      })
      .then((rGet) => {
        expect(rGet.status).to.eq(200)
        expect(rGet.body).to.include({
          nome: p.nome,
          preco: p.preco,
          descricao: p.descricao,
          quantidade: p.quantidade,
        })

        const updated = { ...p, descricao: `${p.descricao} (editado)` }
        return Products.update(id, updated, admin.token)
      })
      .then((rPut) => {
        expect([200, 201]).to.include(rPut.status)

        return Products.remove(id, admin.token)
      })
      .then((rDel) => {
        expect(rDel.status).to.eq(200)
        return Products.getById(id)
      })
      .then((rAfter) => {
        expect(rAfter.status).to.eq(400)
        expectErrorContains(rAfter.body, ['produto', 'nao encontrado'])
      })
  })
})