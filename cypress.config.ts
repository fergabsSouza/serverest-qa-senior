import { defineConfig } from "cypress"
import * as fs from "fs"
import * as path from "path"

function loadLocalEnv() {
  try {
    const p = path.resolve("cypress/config/env.local.json")
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf-8")
      return JSON.parse(raw)
    }
  } catch {
  }
  return {}
}

export default defineConfig({
  e2e: {
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
