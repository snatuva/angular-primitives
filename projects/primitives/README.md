# @snatuva/primitives

Headless, directive-first Angular UI primitives focused on behavior, accessibility,
and composability.

This library currently includes:

- Tabs primitives
- Tooltip primitives

## Philosophy

- **Headless**: no styling is imposed by the library.
- **Directive-first**: compose behavior into your own markup.
- **Scoped state**: each primitive root creates an isolated state scope.
- **Accessible by default**: ARIA semantics are wired into directives.

## Installation

```bash
npm install @snatuva/primitives
```

## Exports

```ts
import {
  TabsDirective,
  TabListDirective,
  TabTriggerDirective,
  TabPanelDirective,
  TabContentDirective,
  TooltipDirective,
  TooltipTriggerDirective,
  TooltipContentDirective,
} from '@snatuva/primitives';
```

## Tabs

### Directives

- `apTabs` — root tabs scope/state provider.
- `apTabList` — list container for tab triggers.
- `apTabTrigger` — interactive tab trigger.
  - Required input: `tabId: string`
  - Optional input: `disabled: boolean`
- `apTabPanel` — panel region.
  - Input: `id` (forwarded to ARIA tab panel primitive value)
  - Optional input: `disabled: boolean`
- `apTabContent` — structural directive to conditionally render active panel content.
  - Required input: `tabId: string`

### Minimal usage

```html
<div apTabs>
  <div apTabList>
    <button apTabTrigger tabId="overview">Overview</button>
    <button apTabTrigger tabId="details">Details</button>
  </div>

  <section apTabPanel id="overview">
    <ng-template apTabContent tabId="overview">
      <p>Overview content</p>
    </ng-template>
  </section>

  <section apTabPanel id="details">
    <ng-template apTabContent tabId="details">
      <p>Details content</p>
    </ng-template>
  </section>
</div>
```

### Behavior notes

- The first registered panel is selected by default.
- Selecting a disabled tab is ignored.
- When an active panel is removed, selection falls back to the next available panel.

## Tooltip

### Directives

- `apTooltip` — root tooltip scope/state provider.
- `apTooltipTrigger` — element that opens/closes tooltip on pointer/focus interactions.
- `apTooltipContent` — template for tooltip content.

### Minimal usage

```html
<div apTooltip>
  <button apTooltipTrigger type="button">Hover or focus me</button>

  <ng-template apTooltipContent>
    <span>Helpful tooltip content</span>
  </ng-template>
</div>
```

### Behavior notes

- Opens on `mouseenter` and `focus`.
- Closes on `mouseleave`, `blur`, or <kbd>Escape</kbd>.

## Development

### Build library

```bash
ng build primitives
```

### Run tests

```bash
ng test
```
