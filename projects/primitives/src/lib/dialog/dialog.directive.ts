import {
  Directive,
  Input,
  Output,
  EventEmitter,
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
  @Input() set open(value: boolean) {
    this._open.set(value);
  }

  @Output() openChange = new EventEmitter<boolean>();

  /**
   * Whether the dialog is modal.
   * Modal dialogs trap focus and prevent interaction with content behind them.
   * @default true
   */
  @Input() modal = true;

  /**
   * Whether clicking the backdrop (overlay) closes the dialog.
   * Has no effect when modal=false.
   * @default true
   */
  @Input() closeOnBackdropClick = true;

  /**
   * Whether pressing Escape closes the dialog.
   * @default true
   */
  @Input() closeOnEscape = true;

  /**
   * ARIA role for the dialog panel.
   * Use 'alertdialog' for destructive confirmations that require immediate attention.
   * @default 'dialog'
   */
  @Input() role: 'dialog' | 'alertdialog' = 'dialog';

  /** Unique id used to wire aria-labelledby / aria-describedby */
  readonly dialogId = `ap-dialog-${nextId++}`;

  /** Internal open state signal */
  private readonly _open = signal(false);

  /** Read-only computed open state for child directives */
  readonly isOpen = computed(() => this._open());

  ngOnDestroy(): void {
    // Ensure cleanup if dialog is open when the component is destroyed
    if (this._open()) {
      this._open.set(false);
    }
  }

  /** Opens the dialog */
  openDialog(): void {
    if (this._open()) return;
    this._open.set(true);
    this.openChange.emit(true);
  }

  /** Closes the dialog */
  closeDialog(): void {
    if (!this._open()) return;
    this._open.set(false);
    this.openChange.emit(false);
  }

  /** Toggles the dialog open/close */
  toggle(): void {
    this._open() ? this.closeDialog() : this.openDialog();
  }
}
