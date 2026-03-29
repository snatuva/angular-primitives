# Accessibility Guide for @snatuva/primitives

This guide describes how to implement accessible UI patterns using the primitives in this library, following [Angular Aria guidelines](https://angular.dev/guide/components/accessibility).

## Core Principles

1. **Headless Components**: The primitives are headless, meaning they do **not** include default styles. You are responsible for providing HTML structure and CSS styling.
2. **ARIA Semantics**: ARIA attributes are automatically applied by the directives. You must target these attributes in your CSS to style different states.
3. **Keyboard Navigation**: All primitives support standard keyboard shortcuts (ArrowKeys, Escape, etc.) automatically.
4. **Screen Reader Support**: Always provide meaningful labels and descriptions for assistive technologies.

---

## Tabs Component

### ARIA Implementation

The tabs component implements the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):

| Directive | ARIA Role | Key Attributes |
|-----------|-----------|-----------------|
| `apTabs` | (container) | — |
| `apTabList` | `tablist` | — |
| `apTabTrigger` | `tab` | `aria-selected`, `aria-controls`, `aria-disabled` |
| `apTabPanel` | `tabpanel` | `aria-labelledby`, `aria-hidden` |

### Complete Example

```html
<div apTabs>
  <!-- Tab list container -->
  <div apTabList role="tablist" class="tab-list">
    <!-- Individual tab triggers -->
    <button apTabTrigger tabId="profile" class="tab-trigger">
      Profile
    </button>
    <button apTabTrigger tabId="settings" class="tab-trigger">
      Settings
    </button>
  </div>

  <!-- Tab panels with lazy-loaded content -->
  <div apTabPanel id="profile" value="profile" class="tab-panel">
    <p>Profile content goes here</p>
  </div>

  <div apTabPanel id="settings" value="settings" class="tab-panel">
    <p>Settings content goes here</p>
  </div>
</div>
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| <kbd>Tab</kbd> | Focus first tab or previously focused tab |
| <kbd>Arrow Right</kbd> / <kbd>Arrow Down</kbd> | Focus next tab (wraps to first) |
| <kbd>Arrow Left</kbd> / <kbd>Arrow Up</kbd> | Focus previous tab (wraps to last) |
| <kbd>Home</kbd> | Focus first tab |
| <kbd>End</kbd> | Focus last tab |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate focused tab |

### Styling with ARIA Attributes

Target ARIA attributes to style different states:

```css
/* Active tab styling */
[apTabTrigger][aria-selected='true'] {
  border-bottom: 3px solid #2196f3;
  color: #2196f3;
  font-weight: 600;
}

/* Inactive tab styling */
[apTabTrigger][aria-selected='false'] {
  border-bottom: 3px solid transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Disabled tab styling */
[apTabTrigger][aria-disabled='true'] {
  opacity: 0.5;
  cursor: not-allowed;
  color: #aaa;
}

/* Tab panel styling */
[apTabPanel] {
  padding: 20px;
  border-top: 1px solid #ddd;
}

/* Hidden inactive panels */
[apTabPanel][aria-hidden='true'] {
  display: none;
}

/* Focus visible for keyboard navigation */
[apTabTrigger]:focus-visible {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}
```

### Testing Accessibility

Use the provided `TabsHarness` for accessible component testing:

```typescript
import { TabsHarness } from '@snatuva/primitives';

describe('My Tabs Component', () => {
  it('should select tab by keyboard navigation', async () => {
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      TabsHarness
    );

    // Check ARIA attributes
    const triggers = await harness.getTabTriggers();
    expect(await triggers[0].isActive()).toBe(true);

    // Simulate user interaction
    await harness.selectTabByText('Settings');
    expect(await harness.getActiveTab()?.getText()).toBe('Settings');
  });
});
```

---

## Tooltip Component

### ARIA Implementation

The tooltip component implements a custom ARIA tooltip pattern (no standard Angular Aria directive exists for tooltips):

| Directive | ARIA Role | Key Attributes |
|-----------|-----------|-----------------|
| `apTooltip` | (container) | — |
| `apTooltipTrigger` | (element) | `aria-describedby` |
| `apTooltipContent` | `tooltip` | `id`, unique identifier |

### Complete Example

```html
<div apTooltip>
  <!-- Trigger element -->
  <button apTooltipTrigger 
          type="button"
          class="tooltip-trigger"
          aria-label="More information">
    ?
  </button>

  <!-- Tooltip content (lazy-loaded) -->
  <ng-template apTooltipContent [tooltipId]="'tooltip-help'">
    <div class="tooltip-content">
      This is helpful information about the feature.
    </div>
  </ng-template>
</div>
```

### Usage Notes

- **Keep it concise**: Tooltips should supplement, not duplicate, visible text.
- **Don't hide critical info**: Never hide essential information in tooltips alone.
- **Keyboard accessible**: Tooltips open on focus and close on blur automatically.
- **Mobile friendly**: Consider touch interactions; tooltips may not work on mobile devices.

### Styling with ARIA Attributes

```css
/* Tooltip trigger styling */
[apTooltipTrigger] {
  cursor: help;
  text-decoration: underline dotted;
  font-weight: bold;
  color: #2196f3;
}

/* Tooltip trigger focus state */
[apTooltipTrigger]:focus-visible {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}

/* Tooltip content styling */
[apTooltipContent] {
  position: absolute;
  background: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  max-width: 250px;
  word-wrap: break-word;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Arrow/pointer styling (optional) */
[apTooltipContent]::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #333;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
```

### Testing Accessibility

Use the provided `TooltipHarness` for accessible component testing:

```typescript
import { TooltipHarness } from '@snatuva/primitives';

describe('My Tooltip Component', () => {
  it('should open tooltip on focus', async () => {
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      TooltipHarness
    );

    const trigger = await harness.getTrigger();
    await trigger.focus();

    expect(await harness.isOpen()).toBe(true);
  });

  it('should have proper ARIA attributes', async () => {
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      TooltipHarness
    );

    const content = await harness.getContent();
    expect(await content.getRole()).toBe('tooltip');
    expect(await content.getId()).toBeDefined();
  });
});
```

---

## Accessibility Checklist

When using these primitives, ensure:

- [ ] **Semantic HTML**: Use appropriate HTML elements (buttons, not divs).
- [ ] **ARIA Attributes**: Verify that ARIA attributes are automatically applied.
- [ ] **Keyboard Navigation**: Test keyboard shortcuts work as expected.
- [ ] **Focus Management**: Ensure focus is visible and properly managed.
- [ ] **Color Contrast**: Text has sufficient contrast (WCAG AA minimum 4.5:1 for normal text).
- [ ] **Screen Reader Testing**: Test with screen readers (NVDA, JAWS, VoiceOver).
- [ ] **Labels**: All controls have accessible labels or aria-labels.
- [ ] **Error Messages**: Error messages are clearly announced.
- [ ] **Mobile Testing**: Test on touch devices (tooltips may not work).

---

## Resources

- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Angular Accessibility Guide](https://angular.dev/guide/components/accessibility)
- [WebAIM ARIA Overview](https://webaim.org/articles/aria/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
