# Modern Angular: From Zero to Advanced

This repository contains the project created in the **Modern Angular Course**.

## 🧠 What “Modern Angular” Means in This Project

This project follows **modern Angular best practices**, including:

- ✅ Standalone components (no `NgModule`)
- ✅ Modern Angular CLI defaults
- ✅ Signals-first mental model
- ✅ Built-in control flow (`@if`, `@for`, `@switch`)
- ✅ Modern testing setup
- ✅ Clean, explicit project structure

## 🧭 Course Progression

<details>
<summary>1: Angular Building Blocks</summary>

- 01: [Getting Started](https://youtu.be/cMi3mNWjtyY)
- 02: [Environment Setup](https://youtu.be/GxTBDSiKNeY)
- 03: [Creating the First Component](https://youtu.be/oJJNTyFcsN4)
- 04: [Component Templates and Interactions](https://youtu.be/E9Q1yn3h9d0)
- 05: Writable Signals
- 06: Computed Signals
- 07: Effects

</details>

## 🛠️ Prerequisites

Before running this project, make sure you have:

- **Node.js (LTS)**  
  👉 Recommended installation:
  - macOS / Linux: **nvm**
  - Windows: **Chocolatey** or **nvm-windows**

- **Angular CLI**
  ```bash
  npm install -g @angular/cli
  ```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
