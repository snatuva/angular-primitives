import {
  Directive,
  model,
  input,
  signal,
  computed,
  OnDestroy,
  inject,
} from '@angular/core';

let nextId = 0;

/**
 * `apDialog`
 *
 * Root directive that provides dialog open/close state to all child directives.
 * Acts as the single source of truth — all other dialog directives inject this.
 *
 * Supports both controlled (two-way binding via [(open)]) and
 * uncontrolled usage (internal state only).
 *
 * @example Uncontrolled
 * <div apDialog>
 *   <button apDialogTrigger>Open</button>
 *   <div apDialogOverlay>
 *     <div apDialogContent>
 *       <h2 apDialogTitle>Title</h2>
 *       <button apDialogClose>Close</button>
 *     </div>
 *   </div>
 * </div>
 *
 * @example Controlled
 * <div apDialog [(open)]="isOpen" (openChange)="onOpenChange($event)">
 *   ...
 * </div>
 */
@Directive({
  selector: '[apDialog]',
  standalone: true,
  exportAs: 'apDialog',
})
export class DialogDirective implements OnDestroy {
  /**
   * Two-way binding for open state (controlled mode).
   * When provided, the host component owns the state.
   */
  readonly open = model(false);

  /**
   * Whether the dialog is modal.
   * Modal dialogs trap focus and prevent interaction with content behind them.
   * @default true
   */
  readonly modal = input(true);

  /**
   * Whether clicking the backdrop (overlay) closes the dialog.
   * Has no effect when modal=false.
   * @default true
   */
  readonly closeOnBackdropClick = input(true);

  /**
   * Whether pressing Escape closes the dialog.
   * @default true
   */
  readonly closeOnEscape = input(true);

  /**
   * ARIA role for the dialog panel.
   * Use 'alertdialog' for destructive confirmations that require immediate attention.
   * @default 'dialog'
   */
  readonly role = input<'dialog' | 'alertdialog'>('dialog');

  /** Unique id used to wire aria-labelledby / aria-describedby */
  readonly dialogId = `ap-dialog-${nextId++}`;

  /** Read-only computed open state for child directives */
  readonly isOpen = computed(() => this.open());

  ngOnDestroy(): void {
    // Ensure cleanup if dialog is open when the component is destroyed
    if (this.open()) {
      this.open.set(false);
    }
  }

  /** Opens the dialog */
  openDialog(): void {
    if (this.open()) return;
    this.open.set(true);
  }

  /** Closes the dialog */
  closeDialog(): void {
    if (!this.open()) return;
    this.open.set(false);
  }

  /** Toggles the dialog open/close */
  toggle(): void {
    this.open() ? this.closeDialog() : this.openDialog();
  }
}
