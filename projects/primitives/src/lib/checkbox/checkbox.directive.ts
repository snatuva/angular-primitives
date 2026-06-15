import { Directive, ElementRef, computed, effect, inject, input, model } from '@angular/core';

/**
 * `apCheckbox`
 *
 * Applied directly to a native `<input type="checkbox">`.
 *
 * What native `<input type="checkbox">` gives you automatically:
 * - Keyboard activation (Space toggles)
 * - Click toggles
 * - Focusable, form-associated (participates in `<form>` submission)
 *
 * What this directive adds:
 * - `[checked]` two-way binding via `checked` (a `model()`)
 * - `indeterminate` support (a DOM-only property, kept in sync via an effect)
 * - `data-state="checked|unchecked|indeterminate"` for CSS styling hooks
 *
 * @example
 * <input type="checkbox" apCheckbox [(checked)]="agreed" />
 * <input type="checkbox" apCheckbox [(checked)]="allSelected" [indeterminate]="someSelected" />
 */
@Directive({
  selector: 'input[apCheckbox]',
  standalone: true,
  exportAs: 'apCheckbox',
  host: {
    type: 'checkbox',
    '[attr.data-state]': 'dataState()',
    '[attr.data-disabled]': 'disabled() || null',
    '[checked]': 'checked()',
    '[disabled]': 'disabled()',
    '(change)': 'onChange($event)',
  },
})
export class CheckboxDirective {
  private readonly el = inject(ElementRef<HTMLInputElement>);

  /** Whether the checkbox is checked. Two-way bindable via `[(checked)]`. */
  readonly checked = model(false);

  /**
   * Indeterminate (mixed) state — e.g. a "select all" checkbox when only
   * some children are selected. This is a DOM-only property, not an
   * attribute, so it's applied imperatively via an effect.
   */
  readonly indeterminate = input(false);

  /** Disables the checkbox. */
  readonly disabled = input(false);

  readonly dataState = computed(() => {
    if (this.indeterminate()) return 'indeterminate';
    return this.checked() ? 'checked' : 'unchecked';
  });

  constructor() {
    effect(() => {
      this.el.nativeElement.indeterminate = this.indeterminate();
    });
  }

  onChange(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
