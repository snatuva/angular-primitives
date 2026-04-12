import {
  Directive,
  HostListener,
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
 * The interactive trigger (button) for an accordion item.
 * Must be a descendant of `apAccordionItem`.
 *
 * Accessibility:
 * - Sets `role="button"` (implicit if applied to <button>)
 * - Manages `aria-expanded` reactively
 * - Sets `aria-controls` to associate with the panel
 * - Sets `aria-disabled` when the item or root is disabled
 * - Implements full keyboard support per WAI-ARIA spec:
 *   - Enter / Space  → toggle
 *   - Arrow Down     → focus next trigger (vertical)
 *   - Arrow Up       → focus previous trigger (vertical)
 *   - Arrow Right    → focus next trigger (horizontal)
 *   - Arrow Left     → focus previous trigger (horizontal)
 *   - Home           → focus first trigger
 *   - End            → focus last trigger
 *
 * @example
 * <button apAccordionTrigger>Toggle Section</button>
 */
@Directive({
  selector: 'button[apAccordionTrigger]',
  standalone: true,
  exportAs: 'apAccordionTrigger',
  host: {
    '[attr.aria-expanded]': 'isExpanded()',
    '[attr.aria-controls]': 'panelId()',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.data-state]': 'dataState()',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[disabled]': 'isDisabled()',
    'id': '',  // Set via computed below
    '[id]': 'triggerId()',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class AccordionTriggerDirective implements AfterViewInit {
  private readonly item = inject(AccordionItemDirective);
  private readonly accordion = inject(AccordionDirective);
  private readonly el = inject(ElementRef<HTMLButtonElement>);

  readonly isExpanded = computed(() => this.item.isExpanded());
  readonly isDisabled = computed(() => this.item.isDisabled());
  readonly dataState = computed(() => this.item.dataState());

  /** ID applied to the trigger element — referenced by the panel's aria-labelledby */
  readonly triggerId = computed(() => `ap-accordion-trigger-${this.item.id}`);

  /** ID of the associated panel — applied to aria-controls */
  readonly panelId = computed(() => `ap-accordion-panel-${this.item.id}`);

  ngAfterViewInit(): void {
    // Ensure the native element has the correct id (host binding handles it,
    // but this guards against SSR timing edge cases)
    this.el.nativeElement.id = this.triggerId();
  }

  onClick(): void {
    if (this.isDisabled()) return;
    this.item.toggle();
  }

  onKeydown(event: KeyboardEvent): void {
    const isVertical = this.accordion.orientation === 'vertical';

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
        'button[apAccordionTrigger]:not([disabled])'
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
