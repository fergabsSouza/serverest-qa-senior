import { defineConfig } from "cypress"
import * as fs from "fs"
import * as path from "path"

/**
 * Carrega variáveis de ambiente locais de cypress/config/env.local.json (se existir).
 * Essa leitura permite sobrescrever baseUrl, apiUrl, credenciais, etc. localmente,
 * sem subir nada sensível pro repositório.
 */
function loadLocalEnv() {
  try {
    const p = path.resolve("cypress/config/env.local.json")
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf-8")
      return JSON.parse(raw)
    }
  } catch {
    // silenciosamente ignora erros de leitura/parse
  }
  return {}
}

export default defineConfig({
  e2e: {
    // baseUrl padrão (pode ser sobrescrito por env.local.json)
    baseUrl: "https://front.serverest.dev",

    specPattern: "cypress/e2e/**/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",

    env: {
      apiUrl: "https://serverest.dev",
      ...loadLocalEnv()
    },

    setupNodeEvents(on, config) {
      void on
      return config
    }
  },
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  reporter: "spec"
})
