import { Directive, input, model, computed } from '@angular/core';

/**
 * `apSwitch`
 *
 * Applied directly to a native `<input type="checkbox">` — a two-state
 * toggle control following the WAI-ARIA `switch` pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 *
 * What native `<input type="checkbox">` gives you automatically:
 * - Keyboard activation (Space toggles)
 * - Click toggles
 * - Focusable, form-associated (participates in `<form>` submission)
 *
 * What this directive adds:
 * - `role="switch"` and `aria-checked` for correct switch semantics
 * - `[checked]` two-way binding via `checked` (a `model()`)
 * - `data-state="checked|unchecked"` for CSS styling hooks
 *
 * @example
 * <input type="checkbox" apSwitch [(checked)]="airplaneMode" />
 */
@Directive({
  selector: 'input[apSwitch]',
  standalone: true,
  exportAs: 'apSwitch',
  host: {
    type: 'checkbox',
    role: 'switch',
    '[attr.aria-checked]': 'checked()',
    '[attr.data-state]': 'dataState()',
    '[attr.data-disabled]': 'disabled() || null',
    '[checked]': 'checked()',
    '[disabled]': 'disabled()',
    '(change)': 'onChange($event)',
  },
})
export class SwitchDirective {
  /** Whether the switch is on. Two-way bindable via `[(checked)]`. */
  readonly checked = model(false);

  /** Disables the switch. */
  readonly disabled = input(false);

  readonly dataState = computed(() => (this.checked() ? 'checked' : 'unchecked'));

  onChange(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
