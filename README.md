[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/) [![build](https://img.shields.io/travis/wizeline/access-decision-manager/master.svg)](https://travis-ci.org/wizeline/access-decision-manager)

### Access-decision-manager.

This repo maintains the following npm packages

- [access-decision-manager](https://github.com/wizeline/access-decision-manager/tree/master/packages/access-decision-manager)
- [access-decision-manager-express](https://github.com/wizeline/access-decision-manager/tree/master/packages/access-decision-manager-express)

Their main objective is to determine access rights based on the [Voter](https://symfony.com/doc/current/security/voters.html) pattern

### Getting Started

If you'd like to contribute to this project, a great place to get started it so checkout the project and make sure that the tests are working for you.

To do this the following steps can be followed:

1. Clone the project.
   ```bash
   git clone git@github.com:wizeline/access-decision-manager.git
   ```
2. Install the dependencies. We use [`npm ci`](https://docs.npmjs.com/cli/v8/commands/npm-ci) to ensure the same packages are installed on all machines.
   ```bash
   npm ci
   ```
3. Use Lerna to link the sub-packages against each other.
   ```bash
   npm run link
   ```
4. Ensure that the `examples` have their dependencies installed as well.

   **Note:** Ideally this wouldn't be required. Pull requests welcome!

   ```bash
   for exampleDir in packages/*/examples/*; do
      cd $exampleDir
      npm ci
      cd -
   done
   ```

5. Run the tests.
   ```bash
   npm test
   ```
