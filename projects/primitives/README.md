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
    <!-- Automatically gets role="tab", aria-selected, aria-controls -->
    <button apTabTrigger tabId="overview">Overview</button>
    <button apTabTrigger tabId="details">Details</button>
  </div>

  <!-- Automatically gets role="tabpanel", aria-labelledby, aria-hidden -->
  <section apTabPanel id="overview" value="overview">
    <p>Overview content</p>
  </section>

  <section apTabPanel id="details" value="details">
    <p>Details content</p>
  </section>
</div>
```

### Behavior notes

- The first registered panel is selected by default.
- Selecting a disabled tab is ignored.
- When an active panel is removed, selection falls back to the next available panel.

### Accessibility (ARIA)

✅ **Automatic - No manual configuration needed!**

**Built-in ARIA attributes:**
- `apTabList` → `role="tablist"`
- `apTabTrigger` → `role="tab"`, `aria-selected="true|false"`, `aria-controls="[panel-id]"`, `tabindex` management
- `apTabPanel` → `role="tabpanel"`, `aria-labelledby="[trigger-id]"`, `aria-hidden="true|false"`, `id` auto-generated

**Built-in keyboard navigation:**
- <kbd>Arrow Right</kbd> / <kbd>Arrow Left</kbd> — Switch between tabs
- <kbd>Arrow Down</kbd> / <kbd>Arrow Up</kbd> — Switch between tabs
- <kbd>Home</kbd> — Jump to first tab
- <kbd>End</kbd> — Jump to last tab
- <kbd>Tab</kbd> — Focus management with roving tabindex

**CSS Styling Example:**

```css
/* Target active tab */
[apTabTrigger][aria-selected='true'] {
  border-bottom: 2px solid #2196f3;
  font-weight: bold;
}

/* Target disabled tab */
[apTabTrigger][aria-disabled='true'] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Style tab panels */
[apTabPanel] {
  padding: 20px;
}

/* Hide inactive panels */
[apTabPanel][aria-hidden='true'] {
  display: none;
}
```

## Tooltip

### Directives

- `apTooltip` — root tooltip scope/state provider.
- `apTooltipTrigger` — element that opens/closes tooltip on pointer/focus interactions.
- `apTooltipContent` — template for tooltip content.

### Minimal usage

```html
<div apTooltip>
  <!-- Automatically gets role="button", aria-describedby, aria-expanded, tabindex -->
  <button apTooltipTrigger type="button">Hover or focus me</button>

  <!-- Automatically gets role="tooltip" and unique id -->
  <ng-template apTooltipContent>
    <span>Helpful tooltip content</span>
  </ng-template>
</div>
```

### Behavior notes

- Opens on `mouseenter` and `focus`.
- Closes on `mouseleave`, `blur`, or <kbd>Escape</kbd>.

### Accessibility (ARIA)

✅ **Automatic - No manual configuration needed!**

**Built-in ARIA attributes:**
- `apTooltipContent` → `role="tooltip"`, unique `id` auto-generated
- `apTooltipTrigger` → `role="button"`, `aria-describedby="[tooltip-id]"`, `aria-expanded="true|false"`, `tabindex="0"`

**Built-in keyboard navigation:**
- <kbd>Enter</kbd> / <kbd>Space</kbd> — Open tooltip (if not already open)
- <kbd>Escape</kbd> — Close tooltip
- <kbd>Tab</kbd> — Move focus (closes tooltip automatically on blur)
- Mouse hover / Focus events — Auto show/hide

**Best Practices:**
- Use tooltips for supplemental information only.
- Don't rely on tooltips for critical information.
- Ensure tooltip content is concise and helpful.

**CSS Styling Example:**

```css
/* Style tooltip trigger */
[apTooltipTrigger] {
  cursor: help;
  text-decoration: underline dotted;
}

/* Style tooltip content */
[apTooltipContent] {
  background: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  max-width: 200px;
  z-index: 1000;
}

/* Add arrow pointer (optional) */
[apTooltipContent]::before {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #333;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
```

## Development

### Build library

```bash
ng build primitives
```

### Run tests

```bash
ng test
```
