
# E2E Heuristics Spec

This Cypress spec (`e2e/heuristics.cy.ts`) scaffolds tests derived from the Nielsen Norman heuristics checklist.

## How to run

1. Ensure your app is running and Cypress `baseUrl` points to it.
2. Enable the tests (they're skipped by default to avoid false failures):
```bash
RUN_UI_CHECKS=true npx cypress run --spec e2e/heuristics.cy.ts
# or
RUN_UI_CHECKS=true npx cypress open
```
3. Expand the scaffolded tests with app-specific actions (file uploads, form inputs, etc.).

## Notes
- The spec embeds the checklist and generates describes/its dynamically.
- Many tests are scaffolds with minimal smoke assertions; expand them per your selectors.
- Install `@cypress/axe` and add accessibility checks if desired.
