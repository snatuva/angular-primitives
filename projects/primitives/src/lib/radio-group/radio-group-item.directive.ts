import { Directive, computed, inject, input } from '@angular/core';
import { RadioGroupDirective } from './radio-group.directive';

/**
 * `apRadioGroupItem`
 *
 * Applied directly to a native `<input type="radio">` within an
 * `apRadioGroup`.
 *
 * What this directive adds:
 * - Binds `name` to the parent group's shared `name`, so the native
 *   radio buttons behave as a mutually-exclusive set
 * - `[checked]` reflects whether this item's `value` matches the group's value
 * - `(change)` updates the group's `value`
 * - `data-state="checked|unchecked"` for CSS styling hooks
 * - Disabled state inherited from the group, or set per-item
 *
 * @example
 * <input type="radio" apRadioGroupItem value="pro" />
 */
@Directive({
  selector: 'input[apRadioGroupItem]',
  standalone: true,
  exportAs: 'apRadioGroupItem',
  host: {
    type: 'radio',
    '[name]': 'group.name',
    '[value]': 'value()',
    '[checked]': 'isChecked()',
    '[disabled]': 'isDisabled()',
    '[attr.data-state]': 'dataState()',
    '[attr.data-disabled]': 'isDisabled() || null',
    '(change)': 'onChange()',
  },
})
export class RadioGroupItemDirective {
  protected readonly group = inject(RadioGroupDirective);

  /** The value this radio item represents within the group. */
  readonly value = input.required<string>();

  /** Disables this item only. */
  readonly disabled = input(false);

  readonly isChecked = computed(() => this.group.value() === this.value());
  readonly isDisabled = computed(() => this.disabled() || this.group.disabled());
  readonly dataState = computed(() => (this.isChecked() ? 'checked' : 'unchecked'));

  onChange(): void {
    this.group.select(this.value());
  }
}
