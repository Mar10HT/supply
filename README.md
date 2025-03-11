# Vehicle Fleet System

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.2. Created for manage IHTT's vehicle fleet.

## Required Dependencies
You must install [Angular CLI](https://github.com/angular/angular-cli) with the required [NodeJS](https://nodejs.org/en) version.

## Recommended Dependencies
Is strongly recommended to use [Bun](https://bun.sh/) instead of npm. The bun binaries are included in the repository.

## Environment Variables
This system is related to the [Vehicle System Api](https://github.com/Ajuriaa/api-vehicle-fleet.git), you are required to put the API_URL and FILES_URL in the /src/environments/environments.ts file, a template is found in the same folder.

## Development server

Run `bun run dev` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `bun run build` to build the project. The build artifacts will be stored in the `dist/vehicle-fleet-system/browser` directory.

## Running linter

Run `bun run lint` to execute the linter, and fix fixable linting errors, via [Eslint for Typescript](https://typescript-eslint.io/)

## Documentation

Install globally compodoc with `bun i -g @compodoc/compodoc`. Create a file named `tsconfig.doc.json` at the root of the project with the following inside:
```
  {
    "include": ["src/**/*.ts"],
    "exclude": ["src/**/*.spec.ts"]
  }
```
Generate the documentation with compodoc with `bun run doc`, this will generate the documentation in the /documentation folder. Then just open the `index.html` file in the browser or run `compodoc -s`, this will create a live server at http://localhost:8080.

NOTE: REMOVE THE `tsconfig.doc.json` FILE AND THE /documentation FOLDER BEFORE BUILDING A NEW VERSION, OTHERWISE LAZY LOADING WILL NOT WORK IN BUILD.
