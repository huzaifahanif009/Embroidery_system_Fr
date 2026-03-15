# Threadwork Studio ERP — Angular v20 Frontend

## Quick Start

```bash
# 1. Unzip & enter project
cd embroidery-erp-v20

# 2. Install (requires Node 20+ and npm registry access)
npm install

# 3. Start dev server
npm start
# Opens at http://localhost:4200
```

## Login

The login page pre-fills demo credentials. Just click **Sign in**.

| Field    | Value               |
|----------|---------------------|
| Email    | admin@system.local  |
| Password | Admin@1234567       |
| Tenant   | system-admin        |

> Login POSTs to `http://localhost:3000/api/v1/auth/login`  
> All other screens use **mock data** — no backend required after login.  
> To bypass login entirely, open `auth.guard.ts` and return `true` always.

---

## Angular v20 Features Used

- **Standalone Components** — no NgModules anywhere
- **Functional Guards** (`CanActivateFn`)
- **Functional HTTP Interceptors** (`HttpInterceptorFn`)
- **`provideRouter` + `provideHttpClient`** — tree-shakeable providers
- **`provideAnimationsAsync`** — async animations
- **Lazy-loaded routes** via `loadComponent`
- **AG Grid v33 `themeQuartz` API** — programmatic theming (no CSS class approach)
- **Typed Reactive Forms** with `FormGroup`

---

## Design System (Threadwork Theme)

Colors are defined as CSS custom properties in `src/styles.scss`:

| Variable                | Value      | Usage                          |
|-------------------------|------------|--------------------------------|
| `--tw-sidebar-bg`       | `#2d3a2e`  | Sidebar background             |
| `--tw-sidebar-accent`   | `#c8b560`  | Active item highlight          |
| `--tw-body-bg`          | `#f5f4ef`  | Page background (warm cream)   |
| `--tw-primary`          | `#2d3a2e`  | Primary buttons                |
| `--tw-accent`           | `#c8b560`  | Accent/gold elements           |
| `--tw-text`             | `#1c2420`  | Primary text                   |

---

## Project Structure

```
src/app/
├── core/
│   ├── services/       auth, toast, storage (+ base-api)
│   ├── guards/         authGuard (functional)
│   ├── interceptors/   authInterceptor, errorInterceptor (functional)
│   ├── models/         TypeScript interfaces
│   └── constants/      Dropdown option arrays
│
├── shared/
│   ├── components/
│   │   ├── base/           BaseComponent (destroy$, loading, saving)
│   │   ├── ag-grid/        ErpGridComponent (themeQuartz) + GridActionsComponent
│   │   ├── modal/          ModalComponent (create/edit/view)
│   │   ├── page-header/    PageHeaderComponent with New button
│   │   ├── status-badge/   Colour-coded status pills
│   │   ├── confirm-dialog/ PrimeNG confirm wrapper
│   │   └── loader/         Full-screen spinner
│   └── services/       MockService (all ERP data)
│
├── layout/
│   └── components/
│       ├── sidebar/    Dark olive sidebar matching screenshot
│       ├── header/     Search bar + user avatar
│       └── shell/      App shell (sidebar + header + router-outlet)
│
└── features/           (all lazy-loaded standalone components)
    ├── auth/login/
    ├── dashboard/
    ├── hr/             employees | attendance | leaves
    ├── machines/       registry | maintenance | oee
    ├── inventory/      items | reorder
    ├── orders/         work-orders | quotations | production
    ├── finance/ap/     vendors
    ├── finance/ar/     customers
    └── settings/       company | departments | financial-year
```

---

## AG Grid v33 Setup

AG Grid v33 uses the **Params API** for theming instead of CSS classes:

```typescript
import { themeQuartz, colorSchemeLightWarm } from 'ag-grid-community';

const myTheme = themeQuartz
  .withPart(colorSchemeLightWarm)
  .withParams({
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    headerHeight: 34,
    rowHeight: 36,
    headerBackgroundColor: '#f5f4ef',
    borderColor: '#e8e6df',
    rowHoverColor: '#f9f8f3',
    wrapperBorderRadius: 8,
  });
```

Then pass it to `<ag-grid-angular [theme]="myTheme">`.

---

## Adding a New Module

1. Create `src/app/features/my-module/my-module.component.ts`
2. Copy the pattern from any existing feature (e.g. `employees.component.ts`)
3. Add a route in `app.routes.ts`:
   ```ts
   { path: 'my-module', loadComponent: () =>
     import('./features/my-module/my-module.component').then(m => m.MyModuleComponent) }
   ```
4. Add sidebar entry in `sidebar.component.ts` `navItems` array
5. Add mock data in `mock.service.ts`

---

## CSS Utility Classes

The global stylesheet exposes compact utility classes:

```scss
.tw-btn .tw-btn-primary .tw-btn-outline .tw-btn-sm .tw-btn-xs
.tw-card  .tw-stat-card
.tw-badge .tw-badge-green .tw-badge-amber .tw-badge-red .tw-badge-blue .tw-badge-purple .tw-badge-slate
.tw-input .tw-select .tw-textarea .tw-label-field
.tw-form-group
.tw-flex .tw-items-center .tw-justify-between .tw-gap-2 .tw-grid-2 .tw-grid-4
.tw-section-title .tw-page-title .tw-text-muted .tw-text-subtle
```
