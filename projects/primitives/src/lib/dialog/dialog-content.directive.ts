import {
  Directive,
  inject,
  computed,
  effect,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { DialogDirective } from './dialog.directive';

/**
 * `apDialogContent`
 *
 * Applied directly to a native `<dialog>` element. Drives the element's
 * `showModal()` / `show()` / `close()` lifecycle from the `apDialog` open
 * state, and wires up the accessibility contract on top of what the
 * browser already provides for free.
 *
 * What the native `<dialog>` element gives you automatically:
 * - Top-layer rendering (no z-index management)
 * - `::backdrop` pseudo-element (style with Tailwind's `backdrop:` variant)
 * - Focus trap while open (modal mode)
 * - Focus restored to the trigger when closed
 * - Escape key closes the dialog (fires a cancelable `cancel` event)
 * - Implicit `role="dialog"` accessible semantics
 *
 * What this directive adds:
 * - `aria-labelledby` — wired to `apDialogTitle`'s id
 * - `aria-describedby` — wired to `apDialogDescription`'s id (if present)
 * - `role="alertdialog"` support via the root `role` input
 * - `data-state="open|closed"` for CSS animation hooks
 * - Click-outside-to-close (clicking the `::backdrop` area)
 * - Respects `closeOnEscape` / `closeOnBackdropClick` / `modal` inputs
 *
 * @example
 * <dialog apDialogContent>
 *   <h2 apDialogTitle>Confirm deletion</h2>
 *   <p apDialogDescription>This action cannot be undone.</p>
 *   <button apDialogClose>Cancel</button>
 *   <button (click)="onConfirm()">Delete</button>
 * </dialog>
 */
@Directive({
  selector: 'dialog[apDialogContent]',
  standalone: true,
  exportAs: 'apDialogContent',
  host: {
    '[attr.role]': 'role()',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
    '[attr.id]': 'panelId()',
    '[attr.data-state]': 'dataState()',
    '(cancel)': 'onCancel($event)',
    '(close)': 'onNativeClose()',
    '(click)': 'onClick($event)',
  },
})
export class DialogContentDirective implements OnDestroy {
  private readonly dialog = inject(DialogDirective);
  private readonly el = inject(ElementRef<HTMLDialogElement>);

  readonly isOpen = this.dialog.isOpen;
  readonly role = computed(() => this.dialog.role());
  readonly dataState = computed(() => (this.isOpen() ? 'open' : 'closed'));
  readonly panelId = computed(() => `${this.dialog.dialogId}-panel`);
  readonly titleId = computed(() => `${this.dialog.dialogId}-title`);
  readonly descriptionId = computed(() => `${this.dialog.dialogId}-description`);

  constructor() {
    // Drive the native dialog element from the `open` state.
    effect(() => {
      const native = this.el.nativeElement;

      if (this.isOpen()) {
        if (!native.open) {
          this.dialog.modal() ? native.showModal() : native.show();
        }
      } else if (native.open) {
        native.close();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.el.nativeElement.open) {
      this.el.nativeElement.close();
    }
  }

  /** Escape key — the browser fires a cancelable `cancel` event before closing. */
  onCancel(event: Event): void {
    if (!this.dialog.closeOnEscape()) {
      event.preventDefault();
    }
  }

  /** Fires whenever the dialog closes natively (Escape, close(), etc). Keep state in sync. */
  onNativeClose(): void {
    this.dialog.closeDialog();
  }

  /**
   * The `<dialog>` element's own box only covers its content area — a click
   * that lands on `event.target === dialog` means the user clicked the
   * `::backdrop`, i.e. outside the content.
   */
  onClick(event: MouseEvent): void {
    if (
      event.target === this.el.nativeElement &&
      this.dialog.modal() &&
      this.dialog.closeOnBackdropClick()
    ) {
      this.dialog.closeDialog();
    }
  }
}
