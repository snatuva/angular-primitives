import { Directive, inject, ElementRef, OnInit } from '@angular/core';
import { SelectState } from './select.state';

/**
 * `apSelectTrigger`
 *
 * The button or element that opens the select dropdown.
 */
@Directive({
  selector: '[apSelectTrigger]',
  standalone: true,
  host: {
    'role': 'combobox',
    'aria-haspopup': 'listbox',
    '[attr.aria-expanded]': 'state.isOpen()',
    '[attr.aria-controls]': 'state.isOpen() ? state.listboxId() : null',
    '[attr.aria-activedescendant]': 'state.isOpen() ? state.activeOptionId() : null',
    '[attr.aria-disabled]': 'state.disabled()',
    '[attr.disabled]': 'state.disabled() ? "" : null',
    '[attr.data-state]': 'state.isOpen() ? "open" : "closed"',
    '[attr.data-disabled]': 'state.disabled() ? "" : null',
    '[tabindex]': 'state.disabled() ? -1 : 0',
    '(click)': 'onClick()',
    '(keydown)': 'onKeyDown($event)',
  }
})
export class SelectTriggerDirective implements OnInit {
  protected state = inject(SelectState);
  private el = inject(ElementRef<HTMLElement>);

  ngOnInit() {
    this.state.triggerElement.set(this.el.nativeElement);
  }

  onClick() {
    if (!this.state.disabled()) {
      this.state.toggle();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.state.disabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.state.isOpen()) {
          this.state.selectActive();
        } else {
          this.state.open();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.state.isOpen()) {
          this.state.open();
        } else {
          this.state.moveActive('down');
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.state.isOpen()) {
          this.state.open();
        } else {
          this.state.moveActive('up');
        }
        break;
      case 'Escape':
        if (this.state.isOpen()) {
          event.preventDefault();
          this.state.close();
        }
        break;
    }
  }
}
