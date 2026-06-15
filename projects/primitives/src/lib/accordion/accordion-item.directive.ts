import {
  Directive,
  input,
  OnDestroy,
  inject,
  computed,
  effect,
  ElementRef,
} from '@angular/core';
import { AccordionDirective } from './accordion.directive';

/**
 * `apAccordionItem`
 *
 * Applied directly to a native `<details>` element. Scopes a single
 * accordion item and keeps the element's `open` property in sync with
 * the root accordion's expanded state.
 *
 * What native `<details>` gives you automatically:
 * - Visibility toggling of content (no `hidden`/`display` management needed)
 * - Built-in disclosure triangle (style or hide via `summary::marker` / `::-webkit-details-marker`)
 * - Find-in-page and print expand the content even when collapsed
 *
 * What this directive adds:
 * - Syncs `open` with the root accordion's expanded state (single/multiple modes)
 * - Intercepts the native `toggle` event so `type="single"`,
 *   `collapsible`, and `disabled` rules are respected
 * - `data-state="open|closed"` for CSS animation hooks
 *
 * @example
 * <details apAccordionItem itemId="section-1">
 *   <summary apAccordionTrigger>Section 1</summary>
 *   <div apAccordionContent>...</div>
 * </details>
 */
@Directive({
  selector: 'details[apAccordionItem]',
  standalone: true,
  exportAs: 'apAccordionItem',
  host: {
    '[attr.data-state]': 'dataState()',
    '[attr.data-disabled]': 'isDisabled() || null',
    '(toggle)': 'onToggle()',
  },
})
export class AccordionItemDirective implements OnDestroy {
  private readonly accordion = inject(AccordionDirective);
  private readonly el = inject(ElementRef<HTMLDetailsElement>);

  /**
   * Unique identifier for this item.
   * Used to associate the trigger and panel via ARIA attributes.
   */
  readonly id = input.required<string>({ alias: 'itemId' });

  /**
   * Whether this specific item is disabled.
   * The root accordion's `disabled` input also disables all items.
   */
  readonly disabled = input(false);

  /** Whether this item is currently expanded */
  readonly isExpanded = computed(() => this.accordion.isExpanded(this.id()));

  /** Whether this item is effectively disabled (self or root) */
  readonly isDisabled = computed(() => this.disabled() || this.accordion.disabled());

  /** Data state string for CSS styling hooks */
  readonly dataState = computed(() => (this.isExpanded() ? 'open' : 'closed'));

  constructor() {
    // Keep the native <details> element's `open` property in sync with
    // the accordion's expanded state (controlled value, default value,
    // or another item being toggled in `type="single"` mode).
    effect(() => {
      const expanded = this.isExpanded();
      if (this.el.nativeElement.open !== expanded) {
        this.el.nativeElement.open = expanded;
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up: collapse this item if it's open when destroyed
    if (this.isExpanded()) {
      this.accordion.collapse(this.id());
    }
  }

  /** Toggle this item's expanded state */
  toggle(): void {
    if (this.isDisabled()) return;
    this.accordion.toggle(this.id());
  }

  /**
   * The browser toggles `<details>` natively when its `<summary>` is
   * activated — before our state has had a chance to weigh in. Reconcile:
   * - If disabled, revert the native toggle entirely.
   * - Otherwise, forward to the accordion (which applies `type`/`collapsible`
   *   rules) and, if the accordion's resulting state still disagrees with
   *   the native element, correct it synchronously to avoid a visible flicker.
   */
  onToggle(): void {
    const native = this.el.nativeElement;

    if (this.isDisabled()) {
      native.open = this.isExpanded();
      return;
    }

    if (native.open !== this.isExpanded()) {
      this.accordion.toggle(this.id());

      if (native.open !== this.isExpanded()) {
        native.open = this.isExpanded();
      }
    }
  }
}
