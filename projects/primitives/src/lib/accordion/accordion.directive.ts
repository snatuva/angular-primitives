import {
  Directive,
  Input,
  computed,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AccordionType, AccordionOrientation } from './accordion.types';

/**
 * `apAccordion`
 *
 * Root directive that provides accordion state to all child items.
 * Supports single and multiple expansion modes.
 *
 * ARIA: Implements the WAI-ARIA Accordion pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * @example
 * <div apAccordion type="single" [collapsible]="true">
 *   ...
 * </div>
 */
@Directive({
  selector: '[apAccordion]',
  standalone: true,
  exportAs: 'apAccordion',
  host: {
    '[attr.data-orientation]': 'orientation',
  },
})
export class AccordionDirective implements OnChanges {
  /**
   * Whether one or multiple items can be open simultaneously.
   * @default 'single'
   */
  @Input() type: AccordionType = 'single';

  /**
   * Orientation of the accordion.
   * Affects keyboard interaction (Up/Down vs Left/Right arrow keys).
   * @default 'vertical'
   */
  @Input() orientation: AccordionOrientation = 'vertical';

  /**
   * When type="single", allows the open item to be collapsed.
   * When type="multiple", this has no effect (items are always collapsible).
   * @default false
   */
  @Input() collapsible = false;

  /**
   * Disables all accordion items.
   * Individual items can still be disabled independently.
   * @default false
   */
  @Input() disabled = false;

  /**
   * The id(s) of the item(s) that should be expanded by default (uncontrolled).
   */
  @Input() defaultValue: string | string[] | null = null;

  /**
   * Controlled expanded value. Pass a string for type="single",
   * or a string[] for type="multiple".
   * When provided, you must also handle (valueChange) to update it.
   */
  @Input() value: string | string[] | null = null;

  /** Internal expanded state */
  private readonly _expandedIds = signal<Set<string>>(new Set());

  /** Read-only signal exposing currently expanded item ids */
  readonly expandedIds = computed(() => this._expandedIds());

  ngOnChanges(changes: SimpleChanges): void {
    // Sync controlled `value` input into internal signal
    if (changes['value'] && this.value !== null) {
      const ids = Array.isArray(this.value) ? this.value : [this.value];
      this._expandedIds.set(new Set(ids));
    }

    // Seed default value once on first render (uncontrolled mode)
    if (changes['defaultValue'] && this.defaultValue !== null && this.value === null) {
      const ids = Array.isArray(this.defaultValue)
        ? this.defaultValue
        : [this.defaultValue];
      this._expandedIds.set(new Set(ids));
    }
  }

  /** Returns true if the given item id is currently expanded */
  isExpanded(id: string): boolean {
    return this._expandedIds().has(id);
  }

  /**
   * Toggle a specific item's expanded state.
   * Respects `type` and `collapsible` constraints.
   */
  toggle(id: string): void {
    if (this.disabled) return;

    const current = this._expandedIds();
    const isOpen = current.has(id);

    if (this.type === 'single') {
      if (isOpen) {
        // Only collapse if collapsible is true
        if (this.collapsible) {
          this._expandedIds.set(new Set());
        }
      } else {
        this._expandedIds.set(new Set([id]));
      }
    } else {
      // type === 'multiple'
      const next = new Set(current);
      isOpen ? next.delete(id) : next.add(id);
      this._expandedIds.set(next);
    }
  }

  /** Expand a specific item (no-op if already expanded or disabled) */
  expand(id: string): void {
    if (this.disabled) return;
    const current = this._expandedIds();
    if (current.has(id)) return;

    if (this.type === 'single') {
      this._expandedIds.set(new Set([id]));
    } else {
      this._expandedIds.set(new Set([...current, id]));
    }
  }

  /** Collapse a specific item (no-op if already collapsed) */
  collapse(id: string): void {
    const current = this._expandedIds();
    if (!current.has(id)) return;
    const next = new Set(current);
    next.delete(id);
    this._expandedIds.set(next);
  }
}
