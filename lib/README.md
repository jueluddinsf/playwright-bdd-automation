# lib/ — Packed Step Library

This folder contains the pre-built `playwright-bdd-steps` npm package as a `.tgz` file.

## ⚠️ DO NOT EDIT

The step definitions inside this package are maintained by the **QA Platform team**.
The source code lives in a **separate private repository** and is not included here.

---

## How to Install

```bash
npm install ./lib/playwright-bdd-steps-1.0.0.tgz
```

This is already set up in `package.json`. Running `npm install` in the project root is sufficient.

---

## How to Update (QA Platform Team Only)

When the QA Platform team releases a new version:

1. Receive the new `.tgz` file from the QA Platform team
2. Drop it into this `lib/` folder
3. Remove the old `.tgz`
4. Update the install reference:
   ```bash
   npm install ./lib/playwright-bdd-steps-1.1.0.tgz
   ```
5. Commit `lib/playwright-bdd-steps-1.1.0.tgz` and the updated `package.json`

---

## Future: Nexus Registry

Once the package is published to the company Nexus registry, this folder will no longer be needed.
The install command will become:

```bash
npm install playwright-bdd-steps --registry https://nexus.your-org.com/repository/npm-private/
```
