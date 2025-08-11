// cypress/e2e/api/users.cy.ts
import * as Users from "../../../src/services/userService";
import { makeRandomUser } from "../../../src/helpers/generateData";
import { randomAlphaNumId } from "../../../src/helpers/id";
import { expectErrorContains } from "../../../src/helpers/assertions";

describe("API - Usuários (E2E + cenários de falha)", () => {
  let createdIds: string[] = [];

  afterEach(() => {
    createdIds.forEach((id) => Users.remove(id));
    createdIds = [];
  });

  it("E2E: criar → buscar → editar → excluir (e validar 400 após exclusão)", () => {
    const user = makeRandomUser(false);
    let id = "";

    Users.create(user)
      .then((resCreate) => {
        expect(resCreate.status).to.eq(201);
        id = resCreate.body._id;
        createdIds.push(id);

        return Users.getById(id);
      })
      .then((resGet) => {
        expect(resGet.status).to.eq(200);
        expect(resGet.body).to.include({
          nome: user.nome,
          email: user.email,
          administrador: user.administrador,
        });

        const updated = { ...user, nome: `${user.nome} - editado` };
        return Users.update(id, updated);
      })
      .then((resPut) => {
        expect([200, 201]).to.include(resPut.status);

        return Users.remove(id);
      })
      .then((resDel) => {
        expect(resDel.status).to.eq(200);
        return Users.getById(id);
      })
      .then((resAfter) => {
        expect(resAfter.status).to.eq(400);
        expectErrorContains(resAfter.body, ["usuario", "nao encontrado"]);
      });
  });

  it("negativo: email duplicado (400)", () => {
    const u = makeRandomUser(false);

    Users.create(u)
      .then((r1) => {
        expect(r1.status).to.eq(201);
        createdIds.push(r1.body._id);
        return Users.create(u);
      })
      .then((r2) => {
        expect(r2.status).to.eq(400);
        expectErrorContains(r2.body, ["email", "ja", "usado"]);
      });
  });

  it("buscar por id com FORMATO inválido deve retornar 400 com mensagem de validação", () => {
    const invalid = "id_inexistente_qa";

    Users.getById(invalid).then((r) => {
      expect(r.status).to.eq(400);
      expectErrorContains(r.body, ["exatamente 16", "caracter", "alfanumer"]);
    });
  });

  it("buscar por id VÁLIDO porém INEXISTENTE deve retornar 400 (não encontrado)", () => {
    const fakeId = randomAlphaNumId(16);

    Users.getById(fakeId).then((r) => {
      expect(r.status).to.eq(400);
      expectErrorContains(r.body, ["usuario", "nao encontrado"]);
    });
  });
});
