import {
  Directive,
  inject,
  computed,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { AccordionItemDirective } from './accordion-item.directive';

/**
 * `apAccordionContent`
 *
 * The panel region revealed when an accordion item is expanded.
 * Must be a descendant of `apAccordionItem`.
 *
 * Accessibility:
 * - Sets `role="region"` for landmark navigation
 * - Sets `aria-labelledby` pointing to the associated trigger
 * - Sets `aria-hidden` when collapsed to hide from assistive technology
 * - Sets `hidden` attribute when collapsed (removes from tab order & layout)
 * - Exposes `data-state="open|closed"` for CSS transition hooks
 *
 * CSS animation:
 * Use `data-state` to drive open/close transitions:
 *
 * ```css
 * [apAccordionContent][data-state="open"] {
 *   animation: slideDown 200ms ease-out;
 * }
 * [apAccordionContent][data-state="closed"] {
 *   display: none; // or animate out
 * }
 * ```
 *
 * @example
 * <div apAccordionContent>
 *   <p>Panel content goes here.</p>
 * </div>
 */
@Directive({
  selector: '[apAccordionContent]',
  standalone: true,
  exportAs: 'apAccordionContent',
  host: {
    'role': 'region',
    '[attr.aria-labelledby]': 'triggerId()',
    '[attr.aria-hidden]': '!isExpanded()',
    '[attr.hidden]': '!isExpanded() || null',
    '[attr.data-state]': 'dataState()',
    '[id]': 'panelId()',
  },
})
export class AccordionContentDirective implements AfterViewInit {
  private readonly item = inject(AccordionItemDirective);

  readonly isExpanded = computed(() => this.item.isExpanded());
  readonly dataState = computed(() => this.item.dataState());

  /** Panel id — referenced by the trigger's aria-controls */
  readonly panelId = computed(() => `ap-accordion-panel-${this.item.id}`);

  /** Trigger id — referenced by aria-labelledby */
  readonly triggerId = computed(() => `ap-accordion-trigger-${this.item.id}`);

  ngAfterViewInit(): void {
    // Nothing extra — all state is reactive via host bindings
  }
}
