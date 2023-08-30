# Angular Standalone Components Guide

- Official Docs: [https://angular.io/guide/standalone-components](https://angular.io/guide/standalone-components)
- Migrating to standlone: [https://angular.io/guide/standalone-migration](https://angular.io/guide/standalone-migration)

## Migration steps

This schematic is only available Angular 15.2.0 or later.

Run the schematic with the following command:

```
ng generate @angular/core:standalone
```

Run the migration in the order listed below, verifying that your code builds and runs between each step:

- `ng g @angular/core:standalone` and select "Convert all components, directives and pipes to standalone"
- `ng g @angular/core:standalone` and select "Remove unnecessary NgModule classes"
- `ng g @angular/core:standalone` and select "Bootstrap the project using standalone APIs"

### After the migration

- Find and remove any remaining NgModule declarations: since the "Remove unnecessary NgModules" step cannot remove all modules automatically, you may have to remove the remaining declarations manually.

#### Convert declarations to standalone

Before:

After:
