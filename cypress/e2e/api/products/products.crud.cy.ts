import * as Users from '@services/userService'
import * as Auth from '@services/authService'
import * as Products from '@services/productService'
import type { AdminCtx } from '@app-types/auth'
import  type { CreatedMsg }  from '@app-types/common'


import { makeRandomUser, makeRandomProduct } from '@helpers/generateData'
import { expectErrorContains } from '@helpers/assertions'
import { randomAlphaNumId } from '@helpers/id'

describe('Produtos - Validação & Limites', () => {
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

  it('buscar por id com FORMATO inválido → 400 (valida id 16 alfanum)', () => {
    const invalid = 'id_inexistente_qa'

    Products.getById(invalid).then((r) => {
      expect(r.status).to.eq(400)
      expectErrorContains(r.body, ['exatamente 16', 'caracter', 'alfanumer'])
    })
  })

  it('boundary: PREÇO muito alto (999.999.999) → aceita 201', () => {
    const p = makeRandomProduct()
    p.preco = 999_999_999

    Products.create(p, admin.token).then((r) => {
      expect(r.status).to.eq(201)
      createdProductIds.push(r.body._id)
    })
  })

  it('negativo: PREÇO 0 e QUANTIDADE -1 → 400', () => {
    const p = makeRandomProduct()
    p.preco = 0
    p.quantidade = -1

    Products.create(p, admin.token).then((r) => {
      expect(r.status).to.eq(400)
    })
  })

  it('boundary: QUANTIDADE muito grande (1.000.000) → aceita 201', () => {
    const p = makeRandomProduct()
    p.quantidade = 1_000_000

    Products.create(p, admin.token).then((r) => {
      expect(r.status).to.eq(201)
      createdProductIds.push(r.body._id)
    })
  })

  it('negativo: NOME duplicado → 400', () => {
    const p = makeRandomProduct()

    Products.create(p, admin.token)
      .then((r1) => {
        expect(r1.status).to.eq(201)
        createdProductIds.push(r1.body._id)
        return Products.create(p, admin.token)
      })
      .then((r2) => {
        expect(r2.status).to.eq(400)
        expectErrorContains(r2.body, ['ja', 'existe', 'produto', 'nome'])
      })
  })

  it('PUT: atualizar para NOME já existente → 400', () => {
    const p1 = makeRandomProduct()
    const p2 = makeRandomProduct()
    let id1 = ''
    let id2 = ''

    Products.create(p1, admin.token)
      .then((r1) => {
        expect(r1.status).to.eq(201)
        id1 = r1.body._id
        createdProductIds.push(id1)
        return Products.create(p2, admin.token)
      })
      .then((r2) => {
        expect(r2.status).to.eq(201)
        id2 = r2.body._id
        createdProductIds.push(id2)
        const p2dup = { ...p2, nome: p1.nome }
        return Products.update(id2, p2dup, admin.token)
      })
      .then((rPut) => {
        expect(rPut.status).to.eq(400)
        expectErrorContains(rPut.body, ['ja', 'existe', 'produto', 'nome'])
      })
  })

  it('PUT: id VÁLIDO porém INEXISTENTE → 201 (cadastro)', () => {
    const fakeId = randomAlphaNumId(16)
    const p = makeRandomProduct()

    Products.update(fakeId, p, admin.token).then((r) => {
      expect([200, 201]).to.include(r.status)
      if (r.status === 201 && (r.body as CreatedMsg)?._id) {
        createdProductIds.push((r.body as CreatedMsg)._id)
      } else {
        createdProductIds.push(fakeId)
      }
    })
  })
})
