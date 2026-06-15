import {
  Directive,
  inject,
  computed,
} from '@angular/core';
import { AccordionItemDirective } from './accordion-item.directive';

/**
 * `apAccordionContent`
 *
 * The panel region revealed when an accordion item is expanded.
 * Must be a descendant of `details[apAccordionItem]`, placed after
 * the `<summary apAccordionTrigger>`.
 *
 * Visibility is handled entirely by the native `<details>` element —
 * this directive only adds the accessibility wiring on top:
 * - `role="region"` for landmark navigation
 * - `aria-labelledby` pointing to the associated trigger
 * - `data-state="open|closed"` for CSS transition hooks
 *
 * CSS animation:
 * Use `data-state` to drive open/close transitions:
 *
 * ```css
 * [apAccordionContent][data-state="open"] {
 *   animation: slideDown 200ms ease-out;
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
    '[attr.data-state]': 'dataState()',
    '[id]': 'panelId()',
  },
})
export class AccordionContentDirective {
  private readonly item = inject(AccordionItemDirective);

  readonly isExpanded = computed(() => this.item.isExpanded());
  readonly dataState = computed(() => this.item.dataState());

  /** Panel id — referenced by the trigger's aria-controls */
  readonly panelId = computed(() => `ap-accordion-panel-${this.item.id()}`);

  /** Trigger id — referenced by aria-labelledby */
  readonly triggerId = computed(() => `ap-accordion-trigger-${this.item.id()}`);
}
