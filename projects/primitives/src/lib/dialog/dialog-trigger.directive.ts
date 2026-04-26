import { Directive, inject, computed } from '@angular/core';
import { DialogDirective } from './dialog.directive';

/**
 * `apDialogTrigger`
 *
 * Applied to the element that opens the dialog on click.
 * Must be a descendant of `apDialog`.
 *
 * Accessibility:
 * - `aria-haspopup="dialog"` — signals this button opens a dialog
 * - `aria-expanded` — reflects the dialog's open state
 * - `aria-controls` — associates the trigger with the dialog panel
 *
 * @example
 * <button apDialogTrigger>Open dialog</button>
 */
@Directive({
  selector: 'button[apDialogTrigger]',
  standalone: true,
  exportAs: 'apDialogTrigger',
  host: {
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'panelId()',
    '(click)': 'onClick()',
  },
})
export class DialogTriggerDirective {
  private readonly dialog = inject(DialogDirective);

  readonly isOpen = computed(() => this.dialog.isOpen());
  readonly panelId = computed(() => `${this.dialog.dialogId}-panel`);

  onClick(): void {
    this.dialog.openDialog();
  }
}
