import { Injectable, signal, computed, effect } from '@angular/core';
import { Subject } from 'rxjs';

/** Internal interface tracking registered select options. */
export interface SelectOption {
  id: string;
  value: () => any;
  disabled: () => boolean;
  element: HTMLElement;
}

/**
 * Internal state manager for the Select primitive.
 * Provided at the apSelect root and injected by all child directives.
 */
@Injectable()
export class SelectState<T = any> {
  private static nextId = 0;
  
  /** Unique ID for the select instance. */
  readonly id = `ap-select-${SelectState.nextId++}`;
  
  /** ID linking the trigger to the listbox for ARIA controls. */
  readonly listboxId = computed(() => `${this.id}-listbox`);

  /** Controls whether the dropdown overlay is currently open. */
  readonly isOpen = signal(false);
  
  /** The currently selected value. */
  readonly value = signal<T | null>(null);
  
  /** Whether the entire select is disabled. */
  readonly disabled = signal(false);

  /** Tracks the ID of the option currently focused via keyboard navigation. */
  readonly activeOptionId = signal<string | null>(null);
  
  /** The DOM element of the trigger, used as the origin for the overlay. */
  readonly triggerElement = signal<HTMLElement | null>(null);
  
  /** Reference to the content template. */
  readonly contentTemplate = signal<any>(null);

  /** Internal list of all registered options in DOM order. */
  private readonly _options = signal<SelectOption[]>([]);
  
  /** Read-only view of registered options. */
  readonly options = this._options.asReadonly();

  /** Emits when the internal value is changed by user interaction. */
  readonly onValueChange = new Subject<T>();

  constructor() {
    effect(() => {
      if (this.isOpen() && !this.activeOptionId()) {
        const opts = this._options();
        if (opts.length > 0) {
          const selectedOpt = opts.find(o => o.value() === this.value());
          if (selectedOpt && !selectedOpt.disabled()) {
            this.activeOptionId.set(selectedOpt.id);
          } else {
            const firstAvailable = opts.find(o => !o.disabled());
            if (firstAvailable) {
              this.activeOptionId.set(firstAvailable.id);
            }
          }
        }
      }
    });
  }

  /** Opens the dropdown and resets active option focus. */
  open(): void {
    if (this.disabled()) return;
    this.isOpen.set(true);
  }

  /** Closes the dropdown. */
  close(): void {
    this.isOpen.set(false);
    this.activeOptionId.set(null);
  }

  /** Toggles the dropdown visibility. */
  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  /** Sets the selected value and emits the change event. */
  setValue(val: T): void {
    if (this.value() !== val) {
      this.value.set(val);
      this.onValueChange.next(val);
    }
  }

  /** Registers a new option. */
  registerOption(option: SelectOption): void {
    this._options.update(opts => [...opts, option]);
  }

  /** Removes an option by ID. */
  unregisterOption(id: string): void {
    this._options.update(opts => opts.filter(o => o.id !== id));
  }

  /** Moves the virtual focus up or down the list of enabled options. */
  moveActive(direction: 'up' | 'down'): void {
    const opts = this._options().filter(o => !o.disabled());
    if (opts.length === 0) return;

    const currentId = this.activeOptionId();
    const currentIndex = opts.findIndex(o => o.id === currentId);

    let nextIndex = 0;
    if (currentIndex !== -1) {
      if (direction === 'down') {
        nextIndex = currentIndex < opts.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : opts.length - 1;
      }
    } else {
      nextIndex = direction === 'down' ? 0 : opts.length - 1;
    }

    const nextOpt = opts[nextIndex];
    this.activeOptionId.set(nextOpt.id);
    
    if (nextOpt.element && typeof nextOpt.element.scrollIntoView === 'function') {
      nextOpt.element.scrollIntoView({ block: 'nearest' });
    }
  }

  /** Selects the currently active descendant option. */
  selectActive(): void {
    const activeId = this.activeOptionId();
    if (activeId) {
      const opt = this._options().find(o => o.id === activeId);
      if (opt && !opt.disabled()) {
        this.setValue(opt.value());
        this.close();
      }
    }
  }
}
