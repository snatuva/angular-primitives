import { Directive, input, model } from '@angular/core';

let nextRadioGroupId = 0;

/**
 * `apRadioGroup`
 *
 * Root directive for a group of `input[type=radio][apRadioGroupItem]`
 * elements. Implements the WAI-ARIA `radiogroup` pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 *
 * Native `<input type="radio">` elements sharing a `name` already give you
 * roving keyboard selection (Arrow keys) and single-selection semantics for
 * free. This directive adds:
 * - A shared, auto-generated `name` so items in the group are mutually exclusive
 * - `[(value)]` two-way binding for the selected item's value
 * - `role="radiogroup"` and group-level `disabled` propagation
 *
 * @example
 * <div apRadioGroup [(value)]="plan">
 *   <input type="radio" apRadioGroupItem value="free" />
 *   <input type="radio" apRadioGroupItem value="pro" />
 * </div>
 */
@Directive({
  selector: '[apRadioGroup]',
  standalone: true,
  exportAs: 'apRadioGroup',
  host: {
    role: 'radiogroup',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class RadioGroupDirective {
  /** The currently selected value. Two-way bindable via `[(value)]`. */
  readonly value = model<string | null>(null);

  /** Disables every item in the group. */
  readonly disabled = input(false);

  /** Orientation, used for `aria-orientation`. @default 'vertical' */
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  /** Shared `name` attribute applied to every radio item in this group. */
  readonly name = `ap-radio-group-${++nextRadioGroupId}`;

  /** Selects the given value (no-op if the group is disabled). */
  select(value: string): void {
    if (this.disabled()) return;
    this.value.set(value);
  }
}
