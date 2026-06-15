import {
  Directive,
  inject,
  computed,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { AccordionItemDirective } from './accordion-item.directive';
import { AccordionDirective } from './accordion.directive';

/**
 * `apAccordionTrigger`
 *
 * Applied directly to a native `<summary>` element — the disclosure
 * widget for the parent `<details apAccordionItem>`.
 *
 * What native `<summary>` gives you automatically:
 * - Keyboard activation (Enter / Space toggles the parent `<details>`)
 * - Click toggles the parent `<details>`
 * - A default disclosure triangle (style via `::marker` / `::-webkit-details-marker`)
 * - Focusable by default, with a default accessible role
 *
 * What this directive adds:
 * - `aria-expanded` kept in sync with the accordion's expanded state
 * - `aria-controls` pointing at the associated panel
 * - `aria-disabled` / disabled-aware keyboard & click handling
 *   (native `<summary>` has no `disabled` attribute)
 * - `data-state="open|closed"` for CSS styling hooks
 * - Roving keyboard navigation across sibling triggers per the
 *   WAI-ARIA Accordion pattern (ArrowUp/Down/Left/Right, Home, End)
 *
 * @example
 * <summary apAccordionTrigger>Section 1</summary>
 */
@Directive({
  selector: 'summary[apAccordionTrigger]',
  standalone: true,
  exportAs: 'apAccordionTrigger',
  host: {
    '[attr.aria-expanded]': 'isExpanded()',
    '[attr.aria-controls]': 'panelId()',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.tabindex]': 'isDisabled() ? -1 : null',
    '[attr.data-state]': 'dataState()',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[id]': 'triggerId()',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class AccordionTriggerDirective implements AfterViewInit {
  private readonly item = inject(AccordionItemDirective);
  private readonly accordion = inject(AccordionDirective);
  private readonly el = inject(ElementRef<HTMLElement>);

  readonly isExpanded = computed(() => this.item.isExpanded());
  readonly isDisabled = computed(() => this.item.isDisabled());
  readonly dataState = computed(() => this.item.dataState());

  /** ID applied to the trigger element — referenced by the panel's aria-labelledby */
  readonly triggerId = computed(() => `ap-accordion-trigger-${this.item.id()}`);

  /** ID of the associated panel — applied to aria-controls */
  readonly panelId = computed(() => `ap-accordion-panel-${this.item.id()}`);

  ngAfterViewInit(): void {
    // Ensure the native element has the correct id (host binding handles it,
    // but this guards against SSR timing edge cases)
    this.el.nativeElement.id = this.triggerId();
  }

  /**
   * `<summary>` has no `disabled` attribute, so a disabled trigger would
   * still toggle its `<details>` natively on click. Suppress that here —
   * `AccordionItemDirective.onToggle` also reverts as a backstop.
   */
  onClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      return;
    }

    const isVertical = this.accordion.orientation() === 'vertical';

    switch (event.key) {
      case 'ArrowDown':
        if (isVertical) {
          event.preventDefault();
          this.focusSibling('next');
        }
        break;

      case 'ArrowUp':
        if (isVertical) {
          event.preventDefault();
          this.focusSibling('prev');
        }
        break;

      case 'ArrowRight':
        if (!isVertical) {
          event.preventDefault();
          this.focusSibling('next');
        }
        break;

      case 'ArrowLeft':
        if (!isVertical) {
          event.preventDefault();
          this.focusSibling('prev');
        }
        break;

      case 'Home':
        event.preventDefault();
        this.focusSibling('first');
        break;

      case 'End':
        event.preventDefault();
        this.focusSibling('last');
        break;
    }
  }

  /**
   * Finds all sibling triggers within the same accordion root and
   * moves focus to the target based on direction.
   */
  private focusSibling(direction: 'next' | 'prev' | 'first' | 'last'): void {
    // Query all non-disabled triggers scoped to the nearest accordion root
    const accordionRoot = this.el.nativeElement.closest('[apAccordion], [data-orientation]');
    if (!accordionRoot) return;

    const triggers: any = Array.from(
      accordionRoot.querySelectorAll(
        'summary[apAccordionTrigger]:not([aria-disabled="true"])'
      )
    );

    if (triggers.length === 0) return;

    const currentIndex = triggers.indexOf(this.el.nativeElement);

    let targetIndex: number;

    switch (direction) {
      case 'next':
        targetIndex = (currentIndex + 1) % triggers.length;
        break;
      case 'prev':
        targetIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        break;
      case 'first':
        targetIndex = 0;
        break;
      case 'last':
        targetIndex = triggers.length - 1;
        break;
    }

    triggers[targetIndex]?.focus();
  }
}
