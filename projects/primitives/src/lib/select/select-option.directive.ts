import { Directive, input, inject, ElementRef, OnInit, OnDestroy, computed } from '@angular/core';
import { SelectState } from './select.state';

/**
 * `apSelectOption`
 *
 * Represents a single selectable option inside a select dropdown.
 */
@Directive({
  selector: '[apSelectOption]',
  standalone: true,
  host: {
    'role': 'option',
    '[attr.id]': 'id()',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.data-state]': 'isSelected() ? "selected" : "unselected"',
    '[attr.data-active]': 'isActive() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '(click)': 'onClick($event)',
    '(mouseenter)': 'onMouseEnter()',
  }
})
export class SelectOptionDirective<T> implements OnInit, OnDestroy {
  private state = inject(SelectState);
  private el = inject(ElementRef<HTMLElement>);

  /** The value of this option. */
  readonly value = input.required<T>();

  /** Whether this option is disabled. */
  readonly disabled = input(false);

  private static nextId = 0;
  
  /** Unique ID for the option, used for aria-activedescendant wiring. */
  readonly id = input(`ap-select-option-${SelectOptionDirective.nextId++}`);

  /** Whether this option is currently selected. */
  readonly isSelected = computed(() => this.state.value() === this.value());
  
  /** Whether this option is currently focused via keyboard navigation or hover. */
  readonly isActive = computed(() => this.state.activeOptionId() === this.id());

  ngOnInit(): void {
    this.state.registerOption({
      id: this.id(),
      value: () => this.value(),
      disabled: () => this.disabled(),
      element: this.el.nativeElement
    });
  }

  ngOnDestroy(): void {
    this.state.unregisterOption(this.id());
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.state.setValue(this.value());
      this.state.close();
    }
  }

  onMouseEnter(): void {
    if (!this.disabled()) {
      this.state.activeOptionId.set(this.id());
    }
  }
}
