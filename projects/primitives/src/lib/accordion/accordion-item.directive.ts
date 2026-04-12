import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  inject,
  computed,
  signal,
} from '@angular/core';
import { AccordionDirective } from './accordion.directive';

/**
 * `apAccordionItem`
 *
 * Scopes a single accordion item. Must be a descendant of `apAccordion`.
 * Provides expanded/disabled state to child trigger and panel directives.
 *
 * @example
 * <div apAccordionItem itemId="section-1">
 *   <button apAccordionTrigger>Section 1</button>
 *   <div apAccordionContent>...</div>
 * </div>
 */
@Directive({
  selector: '[apAccordionItem]',
  standalone: true,
  exportAs: 'apAccordionItem',
  host: {
    '[attr.data-state]': 'dataState()',
    '[attr.data-disabled]': 'isDisabled() || null',
  },
})
export class AccordionItemDirective implements OnInit, OnDestroy {
  private readonly accordion = inject(AccordionDirective);

  /**
   * Unique identifier for this item.
   * Used to associate the trigger and panel via ARIA attributes.
   */
  @Input({ required: true, alias: 'itemId' }) id!: string;

  /**
   * Whether this specific item is disabled.
   * The root accordion's `disabled` input also disables all items.
   */
  @Input() disabled = false;

  /** Whether this item is currently expanded */
  readonly isExpanded = computed(() => this.accordion.isExpanded(this.id));

  /** Whether this item is effectively disabled (self or root) */
  readonly isDisabled = computed(() => this.disabled || this.accordion.disabled);

  /** Data state string for CSS styling hooks */
  readonly dataState = computed(() => (this.isExpanded() ? 'open' : 'closed'));

  ngOnInit(): void {
    // If this item was set as a default value, the root accordion already handles it.
    // Nothing extra needed on init — state is derived reactively.
  }

  ngOnDestroy(): void {
    // Clean up: collapse this item if it's open when destroyed
    if (this.isExpanded()) {
      this.accordion.collapse(this.id);
    }
  }

  /** Toggle this item's expanded state */
  toggle(): void {
    if (this.isDisabled()) return;
    this.accordion.toggle(this.id);
  }
}
