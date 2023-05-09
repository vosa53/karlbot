import { defineConfig } from "cypress";

/**
 * Configuration of end-to-end tests in Cypress testing framework.
 */
export default defineConfig({
    e2e: { },
    viewportWidth: 1700,
    viewportHeight: 1000,
    experimentalStudio: true
});
