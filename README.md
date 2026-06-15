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
  TabContentDirective,
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

### Accordion

A vertically stacked set of interactive headings that each reveal an associated section of content.

**Directives**

| Directive | Description | Inputs |
|---|---|---|
| `apAccordion` | Root scope and state provider | `type?: 'single' \| 'multiple'`<br>`collapsible?: boolean`<br>`orientation?: 'vertical' \| 'horizontal'`<br>`disabled?: boolean`<br>`defaultValue?: string \| string[]`<br>`value?: string \| string[]` |
| `apAccordionItem` | Container for a single accordion item | `itemId: string`, `disabled?: boolean` |
| `apAccordionTrigger` | Interactive toggle button | — |
| `apAccordionContent` | Collapsible panel region | — |

**Import**

```ts
import {
  AccordionDirective,
  AccordionItemDirective,
  AccordionTriggerDirective,
  AccordionContentDirective,
} from '@snatuva/primitives';
```

**Usage**

```html
<div apAccordion type="single" [collapsible]="true">
  <div apAccordionItem itemId="item-1">
    <button apAccordionTrigger>Is it accessible?</button>
    <div apAccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</div>
  </div>

  <div apAccordionItem itemId="item-2">
    <button apAccordionTrigger>Is it unstyled?</button>
    <div apAccordionContent>Yes. It's fully headless and unstyled.</div>
  </div>
</div>
```

Keyboard navigation (Arrow keys, Home, End) and ARIA attributes (`aria-expanded`, `aria-controls`, `role="region"`) are handled internally.

---

### Dialog / Modal

A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

**Directives**

| Directive | Description | Inputs / Outputs |
|---|---|---|
| `apDialog` | Root state provider | `open?: boolean`<br>`(openChange)`<br>`modal?: boolean` (default: `true`)<br>`closeOnBackdropClick?: boolean` (default: `true`) |
| `apDialogTrigger` | Button to open the dialog | — |
| `apDialogOverlay` | Backdrop element | — |
| `apDialogContent` | Modal content container | — |
| `apDialogTitle` | ARIA title (`aria-labelledby`) | — |
| `apDialogDescription` | ARIA description (`aria-describedby`) | — |
| `apDialogClose` | Button to close the dialog | — |

**Import**

```ts
import {
  DialogDirective,
  DialogTriggerDirective,
  DialogOverlayDirective,
  DialogContentDirective,
  DialogTitleDirective,
  DialogDescriptionDirective,
  DialogCloseDirective,
} from '@snatuva/primitives';
```

**Usage**

```html
<div apDialog>
  <button apDialogTrigger>Edit Profile</button>

  <div apDialogOverlay class="overlay-styles">
    <div apDialogContent class="panel-styles">
      <h2 apDialogTitle>Edit Profile</h2>
      <p apDialogDescription>Make changes to your profile here.</p>
      
      <!-- Your form content -->
      
      <button apDialogClose>Save Changes</button>
    </div>
  </div>
</div>
```

Focus trapping, background scroll locking, and Escape key functionality are built-in.

---

### Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

**Directives**

| Directive | Description | Inputs |
|---|---|---|
| `apTooltip` | Root state provider | — |
| `apTooltipTrigger` | Element that triggers the tooltip | — |
| `apTooltipContent` | Structural template for tooltip content | `tooltipId?: string` |

**Import**

```ts
import {
  TooltipDirective,
  TooltipTriggerDirective,
  TooltipContentDirective,
} from '@snatuva/primitives';
```

**Usage**

```html
<div apTooltip>
  <button apTooltipTrigger>
    Hover or focus me
  </button>

  <ng-template apTooltipContent tooltipId="custom-tooltip-id">
    <div class="tooltip-panel">
      This is a helpful tooltip message!
    </div>
  </ng-template>
</div>
```

Tooltips automatically map `aria-describedby` and attach via Angular CDK Overlay dynamically.

---

### Switch

A control that toggles between checked and not checked, built on a native `<input type="checkbox">`.

**Directives**

| Directive | Description | Inputs |
|---|---|---|
| `apSwitch` | Applied to `input[type=checkbox]` | `[(checked)]?: boolean` (default: `false`), `disabled?: boolean` |

**Import**

```ts
import { SwitchDirective } from '@snatuva/primitives';
```

**Usage**

```html
<input type="checkbox" apSwitch [(checked)]="airplaneMode" />
```

`role="switch"`, `aria-checked`, and `data-state="checked|unchecked"` are applied automatically. Keyboard activation (Space) and click come for free from the native checkbox.

---

### Checkbox

A control that allows the user to toggle between checked, unchecked, and indeterminate states.

**Directives**

| Directive | Description | Inputs |
|---|---|---|
| `apCheckbox` | Applied to `input[type=checkbox]` | `[(checked)]?: boolean` (default: `false`), `indeterminate?: boolean`, `disabled?: boolean` |

**Import**

```ts
import { CheckboxDirective } from '@snatuva/primitives';
```

**Usage**

```html
<input type="checkbox" apCheckbox [(checked)]="agreed" />

<!-- Indeterminate ("select all") -->
<input type="checkbox" apCheckbox
       [checked]="allChecked()"
       [indeterminate]="someChecked()"
       (checkedChange)="toggleAll($event)" />
```

`indeterminate` is a DOM-only property (not an attribute), so the directive applies it imperatively and reflects it via `data-state="indeterminate"`.

---

### Radio Group

A set of checkable buttons — known as radio buttons — where no more than one can be checked at a time.

**Directives**

| Directive | Description | Inputs |
|---|---|---|
| `apRadioGroup` | Root state provider | `[(value)]?: string \| null`, `disabled?: boolean`, `orientation?: 'horizontal' \| 'vertical'` (default: `'vertical'`) |
| `apRadioGroupItem` | Applied to `input[type=radio]` | `value: string` (required), `disabled?: boolean` |

**Import**

```ts
import { RadioGroupDirective, RadioGroupItemDirective } from '@snatuva/primitives';
```

**Usage**

```html
<div apRadioGroup [(value)]="plan">
  <input type="radio" apRadioGroupItem value="free" />
  <input type="radio" apRadioGroupItem value="pro" />
  <input type="radio" apRadioGroupItem value="team" />
</div>
```

A shared `name` is generated automatically so the native radios behave as a mutually exclusive set, with `role="radiogroup"`, `data-state`, and group-level `disabled` propagation handled for you.

---

## Accessibility

Every primitive is built to satisfy ARIA authoring practices out of the box:

- Semantic roles applied automatically (`role="tab"`, `role="region"`, `role="dialog"`, `role="tooltip"`, etc.)
- Keyboard navigation (Arrow keys, Home, End, Tab, Escape)
- ARIA states (`aria-selected`, `aria-expanded`, `aria-hidden`, etc.) wired up seamlessly
- Focus management and trapping handled internally for overlays like Dialog
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
- [x] Accordion
- [x] Dialog / Modal
- [x] Tooltip
- [x] Select
- [x] Switch
- [x] Checkbox & Radio group
- [x] Documentation site
- [ ] Popover
- [ ] Combobox / Autocomplete
- [ ] Accessibility utilities
- [ ] CDK integrations

---

## Contributing

Contributions are welcome. If you have ideas for new primitives, accessibility improvements, or API refinements, open an issue or pull request.

---

## Author

Built by **Siva Sridhar Natuva**.

---

## License

MIT