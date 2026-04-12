# @snatuva/primitives

> Signals-first Angular primitives for building scalable, accessible UI systems.

[![npm version](https://img.shields.io/npm/v/@snatuva/primitives)](https://www.npmjs.com/package/@snatuva/primitives)
[![Angular](https://img.shields.io/badge/Angular-v17%2B-dd0031)](https://angular.dev)
[![license](https://img.shields.io/npm/l/@snatuva/primitives)](./LICENSE)

---

## Overview

Most Angular component libraries hand you finished UI. `@snatuva/primitives` hands you the foundations — unstyled, composable, and accessible building blocks you wire together your way.

No `NgModule`. No fighting the design system. Just clean primitives built on Angular Signals.

---

## Installation

```bash
npm install @snatuva/primitives
```

Requires **Angular 17+**.

---

## Why primitives?

| Traditional component libraries | `@snatuva/primitives` |
|---|---|
| Opinionated styles, hard to override | Zero styles — you own the look |
| Bulky bundles with unused components | Tree-shakable, import only what you use |
| RxJS-heavy internal state | Angular Signals throughout |
| NgModule-based | Standalone-first |

---

## Primitives

### Tabs

A fully accessible tabs implementation following the [ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

**Directives**

| Directive | Description | Inputs |
|---|---|---|
| `apTabs` | Root scope and state provider | — |
| `apTabList` | Container for tab triggers | `orientation?: 'horizontal' \| 'vertical'` (default: `'horizontal'`) |
| `apTabTrigger` | Interactive tab button | `tabId: string`, `disabled?: boolean` |
| `apTabPanel` | Panel region | `id: string`, `disabled?: boolean` |
| `apTabContent` | Structural directive — conditionally renders active panel | `tabId: string` |

**Import**

```ts
import {
  TabsDirective,
  TabListDirective,
  TabTriggerDirective,
  TabPanelDirective,
} from '@snatuva/primitives';
```

**Usage**

```html
<div apTabs>
  <div apTabList>
    <button apTabTrigger tabId="overview">Overview</button>
    <button apTabTrigger tabId="details">Details</button>
    <button apTabTrigger tabId="settings" [disabled]="true">Settings</button>
  </div>

  <section apTabPanel id="overview">
    <p>Overview content</p>
  </section>
  <section apTabPanel id="details">
    <p>Details content</p>
  </section>
  <section apTabPanel id="settings">
    <p>Settings content</p>
  </section>
</div>
```

ARIA attributes (`role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, `aria-labelledby`, `aria-hidden`) are applied automatically.

**Vertical tabs**

```html
<div apTabs>
  <div apTabList orientation="vertical">
    <button apTabTrigger tabId="profile">Profile</button>
    <button apTabTrigger tabId="billing">Billing</button>
  </div>
  <section apTabPanel id="profile">...</section>
  <section apTabPanel id="billing">...</section>
</div>
```

**Conditional rendering with `apTabContent`**

Use `apTabContent` to defer rendering panel content until the tab is active:

```html
<section apTabPanel id="analytics">
  <ng-template apTabContent tabId="analytics">
    <!-- Only rendered when this panel is active -->
    <app-analytics-chart />
  </ng-template>
</section>
```

---

## Accessibility

Every primitive is built to satisfy ARIA authoring practices out of the box:

- Semantic roles applied automatically
- Keyboard navigation (Arrow keys, Home, End, Tab)
- `aria-selected`, `aria-controls`, `aria-labelledby`, `aria-hidden` wired up
- Focus management handled internally
- Disabled states respected by both keyboard and assistive technology

---

## Core design principles

**Signals-first.** State is managed with Angular Signals. RxJS is used only where it is the right tool, not the default.

**Standalone.** No `NgModule` required. Drop a directive into any standalone component.

**Headless.** Primitives ship with zero styles. You apply your design system on top — CSS, Tailwind, or anything else.

**Composable.** Primitives are scoped and self-contained. Nest them, extend them, or combine them without fighting internal abstractions.

**Tree-shakable.** Only the primitives you import end up in your bundle.

---

## Roadmap

- [x] Tabs
- [z] Accordion
- [ ] Dialog / Modal
- [ ] Popover
- [ ] Select
- [ ] Checkbox & Radio group
- [ ] Toggle / Switch
- [x] Tooltip
- [ ] Accessibility utilities
- [ ] CDK integrations
- [ ] Documentation site

---

## Contributing

Contributions are welcome. If you have ideas for new primitives, accessibility improvements, or API refinements, open an issue or pull request.

---

## Author

Built by **Siva Sridhar Natuva**.

---

## License

MIT
