import { Directive, inject, computed } from '@angular/core';
import { DialogDirective } from './dialog.directive';

/**
 * `apDialogTitle`
 *
 * Applied to the heading element inside the dialog panel.
 * Its generated id is wired to `apDialogContent`'s `aria-labelledby`,
 * creating the accessible name for the dialog.
 *
 * Should be applied to an `<h2>` element for correct heading semantics.
 *
 * @example
 * <h2 apDialogTitle>Delete account</h2>
 */
@Directive({
  selector: '[apDialogTitle]',
  standalone: true,
  exportAs: 'apDialogTitle',
  host: {
    '[id]': 'titleId()',
  },
})
export class DialogTitleDirective {
  private readonly dialog = inject(DialogDirective);
  readonly titleId = computed(() => `${this.dialog.dialogId}-title`);
}


/**
 * `apDialogDescription`
 *
 * Optional directive applied to a description element inside the dialog panel.
 * Its id is wired to `apDialogContent`'s `aria-describedby`, providing an
 * accessible description for screen readers.
 *
 * @example
 * <p apDialogDescription>This action is permanent and cannot be undone.</p>
 */
@Directive({
  selector: '[apDialogDescription]',
  standalone: true,
  exportAs: 'apDialogDescription',
  host: {
    '[id]': 'descriptionId()',
  },
})
export class DialogDescriptionDirective {
  private readonly dialog = inject(DialogDirective);
  readonly descriptionId = computed(() => `${this.dialog.dialogId}-description`);
}


/**
 * `apDialogClose`
 *
 * Applied to any button that should close the dialog when clicked.
 * Can be used multiple times inside a dialog (e.g. Cancel and X buttons).
 *
 * @example
 * <button apDialogClose>Cancel</button>
 * <button apDialogClose aria-label="Close dialog">✕</button>
 */
@Directive({
  selector: 'button[apDialogClose]',
  standalone: true,
  exportAs: 'apDialogClose',
  host: {
    '(click)': 'onClick()',
  },
})
export class DialogCloseDirective {
  private readonly dialog = inject(DialogDirective);

  onClick(): void {
    this.dialog.closeDialog();
  }
}
