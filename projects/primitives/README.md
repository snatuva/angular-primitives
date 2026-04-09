# @snatuva/primitives

🚀 **Signals-first Angular primitives library** for building scalable, reusable UI components.

Designed for modern Angular (v21+), this library provides low-level building blocks ("primitives") to help you create consistent, accessible, and high-performance UI systems.

---

## 📦 Installation

```bash
npm install @snatuva/primitives
```

---

## ⚡ Why this library?

Most Angular component libraries are:

* ❌ Heavy and opinionated
* ❌ Hard to customize
* ❌ Not aligned with modern Angular (Signals, standalone)

**@snatuva/primitives focuses on:**

* ✅ Lightweight, composable primitives
* ✅ Signals-first architecture
* ✅ Standalone component support
* ✅ Tree-shakable design
* ✅ Clean API for enterprise scalability

---

## 🧩 What are “Primitives”?

Primitives are **low-level UI building blocks** (not full components).
Currently available primitives:

* **Tabs**: Flexible tab navigation with accessibility
* **Tooltip**: Overlay-based tooltips with positioning
Instead of giving you a “ready-made UI”, this library gives:

* Flexible foundations
* Full control over styling and behavior
* Better reusability across projects

---

## Tabs Usage

### Directives

- `apTabs` — root tabs scope/state provider.
- `apTabList` — list container for tab triggers.
  - Optional input: `orientation: 'horizontal' | 'vertical'` (default: 'horizontal')
- `apTabTrigger` — interactive tab trigger.
  - Required input: `tabId: string`
  - Optional input: `disabled: boolean`
- `apTabPanel` — panel region.
  - Required input: `id: string` (used for ARIA relationships and state management)
  - Optional input: `disabled: boolean`
- `apTabContent` — structural directive to conditionally render active panel content.
  - Required input: `tabId: string`

### Import into your Angular app

```ts
import {
  TabsDirective,
  TabListDirective,
  TabTriggerDirective,
  TabPanelDirective
} from '@snatuva/primitives';
```

---

### Minimal usage

```html
<div apTabs>
  <div apTabList>
    <!-- Automatically gets role="tab", aria-selected, aria-controls -->
    <button apTabTrigger tabId="overview">Overview</button>
    <button apTabTrigger tabId="details">Details</button>
  </div>

  <!-- Automatically gets role="tabpanel", aria-labelledby, aria-hidden -->
  <section apTabPanel id="overview">
    <p>Overview content</p>
  </section>

  <section apTabPanel id="details">
    <p>Details content</p>
  </section>
</div>
```

---

## Tooltip Usage

### Directives

- `apTooltip` — root tooltip scope/state provider.
- `apTooltipTrigger` — interactive trigger element.
  - Optional inputs: `showDelay: number` (default: 300ms), `hideDelay: number` (default: 150ms)
- `apTooltipContent` — structural directive on `ng-template` for tooltip content.
  - Optional input: `tooltipId: string` (auto-generated if not provided)

### Import into your Angular app

```ts
import {
  TooltipDirective,
  TooltipTriggerDirective,
  TooltipContentDirective
} from '@snatuva/primitives';
```

---

### Minimal usage

```html
<div apTooltip>
  <span apTooltipTrigger>Info</span>
  <ng-template apTooltipContent>
    This is a tooltip with helpful information.
  </ng-template>
</div>
```

### With custom ID and delays

```html
<div apTooltip>
  <button apTooltipTrigger [showDelay]="500" [hideDelay]="200">
    Hover me
  </button>
  <ng-template apTooltipContent [tooltipId]="'custom-tooltip'">
    <div>Custom tooltip content</div>
  </ng-template>
</div>
```

### Features

- **Automatic positioning**: Uses Angular CDK Overlay for flexible positioning
- **Accessibility**: ARIA attributes (`role="tooltip"`, `aria-describedby`, `aria-expanded`)
- **Keyboard support**: Focus/blur, Escape to close
- **Mouse interactions**: Hover to show, leave to hide
- **Configurable delays**: Customize show/hide timing
- **Unique IDs**: Auto-generated or custom tooltip IDs

---

## 🧠 Core Concepts

### 1. Signals-first design

* Uses Angular Signals for state management
* Minimal RxJS usage (only where necessary)

### 2. Standalone components

* No NgModules required
* Easy integration in modern Angular apps

### 3. Composition over configuration

* Build your own components using primitives
* Avoid rigid APIs

---

## ♿ Accessibility (A11y)

This library is designed with accessibility in mind:

* Semantic HTML by default
* Keyboard interaction support
* ARIA best practices
* Focus management patterns

---

## 📁 Project Structure

```bash
projects/
  primitives/
    src/
      lib/
      public-api.ts
```

---

## 🧪 Development

```bash
ng build primitives
```

---

## 📌 Versioning

This project follows semantic versioning:

* PATCH → bug fixes
* MINOR → new features
* MAJOR → breaking changes

---

## 🤝 Contributing

Contributions are welcome!

If you have ideas for:

* New primitives
* Performance improvements
* Accessibility enhancements

Feel free to open an issue or PR.

---

## 📊 Roadmap

* [x] Tabs primitive
* [x] Tooltip primitive
* [ ] Core primitives expansion
* [ ] Accessibility utilities
* [ ] CDK integrations
* [ ] Advanced composition patterns
* [ ] Documentation site

---

## 👨‍💻 Author

Developed by **Siva Sridhar Natuva**

---

## ⭐ Support

If you find this useful:

* Star the repo ⭐
* Share with Angular community
* Use it in your projects

---

## 🔍 Keywords

Angular • Signals • UI Primitives • Component Library • Standalone Components • Design System • Tabs • Tooltip • Accessibility

---
