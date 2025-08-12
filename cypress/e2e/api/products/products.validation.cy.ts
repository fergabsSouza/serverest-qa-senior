import * as Users from '@services/userService'
import * as Auth from '@services/authService'
import * as Products from '@services/productService'

import type { AdminCtx } from '@app-types/auth'
import type { ProductInput, Product, CreateProductRes, ApiMsg, UpdateProductRes } from '@app-types/products'

import { makeRandomUser, makeRandomProduct } from '@helpers/generateData'
import { randomAlphaNumId } from '@helpers/id'
import { expectErrorContains } from '@helpers/assertions'

describe('Produtos - Validações & Limites', () => {
  const admin: AdminCtx = { email: '', password: '', id: '', token: '' }
  const createdProductIds: string[] = []

  before(() => {
    const u = makeRandomUser(true)
    admin.email = u.email
    admin.password = u.password

    return Users.create(u)
      .then((r) => {
        expect(r.status).to.eq(201)
        admin.id = r.body._id
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
    if (admin.id) return Users.remove(admin.id)
  })

  it('id com FORMATO inválido → 400 com mensagem de validação', () => {
    const invalid = 'id_inexistente_qa'

    Products.getById(invalid).then((r) => {
      expect(r.status).to.eq(400)
      expectErrorContains(r.body, ['16', 'alfanumer'])
    })
  })

  it('nome duplicado → 400', () => {
    const p: ProductInput = makeRandomProduct()

    Products.create(p, admin.token)
      .then((r1: Cypress.Response<CreateProductRes>) => {
        expect(r1.status).to.eq(201)
        const id = r1.body._id
        createdProductIds.push(id)
        return Products.create(p, admin.token)
      })
      .then((r2) => {
        expect(r2.status).to.eq(400)
        expectErrorContains(r2.body, ['ja', 'existe', 'produto'])
      })
  })

  it('valores MUITO altos (stress) → 201 e persistência íntegra', () => {
    const big: ProductInput = makeRandomProduct({
      preco: 9_999_999_999,
      quantidade: 2_147_483_647,
    })

    let id = ''
    Products.create(big, admin.token)
      .then((rCreate: Cypress.Response<CreateProductRes>) => {
        expect(rCreate.status).to.eq(201)
        id = rCreate.body._id
        createdProductIds.push(id)
        return Products.getById(id)
      })
      .then((rGet: Cypress.Response<Product>) => {
        expect(rGet.status).to.eq(200)
        expect(rGet.body.preco).to.eq(big.preco)
        expect(rGet.body.quantidade).to.eq(big.quantidade)
      })
  })

  it('PUT em id inexistente (formato válido) → 200|201 (contrato)', () => {
    const fakeId = randomAlphaNumId(16)
    const p: ProductInput = makeRandomProduct()

    Products.update(fakeId, p, admin.token).then((r: Cypress.Response<UpdateProductRes | ApiMsg>) => {
      expect([200, 201]).to.include(r.status)
    })
  })
})
