import * as Users from '@services/userService'
import * as Auth from '@services/authService'
import * as Products from '@services/productService'

import type { AdminCtx } from '@app-types/auth'
import type { ProductInput, CreateProductRes, ApiMsg } from '@app-types/products'

import { makeRandomUser, makeRandomProduct } from '@helpers/generateData'

describe('Produtos - Regras de Autorização', () => {
  const admin: AdminCtx = { email: '', password: '', id: '', token: '' }
  const createdUserIds: string[] = []
  const createdProductIds: string[] = []

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
    const delUsers = createdUserIds.map((uid) => Users.remove(uid))
    return Cypress.Promise.all(delUsers)
  })

  it('criar sem token → 401', () => {
    const p: ProductInput = makeRandomProduct()
    Products.create(p).then((r: Cypress.Response<ApiMsg>) => {
      expect(r.status).to.eq(401)
    })
  })

  it('criar com token de NÃO admin → 403', () => {
    const u = makeRandomUser(false)
    let token = ''

    Users.create(u)
      .then((rUser) => {
        expect(rUser.status).to.eq(201)
        createdUserIds.push(rUser.body._id)
        return Auth.login(u.email, u.password)
      })
      .then((rLogin) => {
        expect(rLogin.status).to.eq(200)
        token = rLogin.body.authorization

        const p: ProductInput = makeRandomProduct()
        return Products.create(p, token)
      })
      .then((r: Cypress.Response<ApiMsg>) => {
        expect(r.status).to.eq(403)
      })
  })

  it('update sem token → 401', () => {
    const p: ProductInput = makeRandomProduct()

    Products.create(p, admin.token)
      .then((rCreate: Cypress.Response<CreateProductRes>) => {
        expect(rCreate.status).to.eq(201)
        const id = rCreate.body._id
        createdProductIds.push(id)

        const upd: ProductInput = { ...p, descricao: `${p.descricao} (upd)` }
        return Products.update(id, upd)
      })
      .then((r: Cypress.Response<ApiMsg>) => {
        expect(r.status).to.eq(401)
      })
  })

  it('delete sem token → 401', () => {
    const p: ProductInput = makeRandomProduct()

    Products.create(p, admin.token)
      .then((rCreate: Cypress.Response<CreateProductRes>) => {
        expect(rCreate.status).to.eq(201)
        const id = rCreate.body._id
        createdProductIds.push(id)
        return Products.remove(id)
      })
      .then((r: Cypress.Response<ApiMsg>) => {
        expect(r.status).to.eq(401)
      })
  })
})
