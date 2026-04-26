import {
  Directive,
  inject,
  computed,
  effect,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { DialogDirective } from './dialog.directive';
import { FocusTrap } from './focus-trap';
import { ScrollLock } from './scroll-lock';

/**
 * `apDialogContent`
 *
 * The dialog panel element. This is where the full accessibility contract lives.
 *
 * Accessibility:
 * - `role="dialog"` (or `"alertdialog"` via the root `role` input)
 * - `aria-modal="true"` when modal mode is enabled
 * - `aria-labelledby` — automatically wired to `apDialogTitle` id
 * - `aria-describedby` — automatically wired to `apDialogDescription` id (if present)
 * - Focus trap: Tab/Shift+Tab constrained within panel when open
 * - Focus restored to trigger element when closed
 * - Escape key closes the dialog (when `closeOnEscape=true`)
 * - Body scroll locked when open (modal mode)
 * - `data-state="open|closed"` for CSS animation hooks
 * - `hidden` attribute applied when closed (removes from tab order)
 *
 * @example
 * <div apDialogContent>
 *   <h2 apDialogTitle>Confirm deletion</h2>
 *   <p apDialogDescription>This action cannot be undone.</p>
 *   <button apDialogClose>Cancel</button>
 *   <button (click)="onConfirm()">Delete</button>
 * </div>
 */
@Directive({
  selector: '[apDialogContent]',
  standalone: true,
  exportAs: 'apDialogContent',
  host: {
    '[attr.role]': 'role()',
    '[attr.aria-modal]': 'isModal()',
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
    '[attr.id]': 'panelId()',
    '[attr.data-state]': 'dataState()',
    '[attr.hidden]': '!isOpen() || null',
    '(keydown)': 'onKeydown($event)',
  },
})
export class DialogContentDirective implements OnDestroy {
  private readonly dialog = inject(DialogDirective);
  private readonly el = inject(ElementRef<HTMLElement>);

  private focusTrap: FocusTrap | null = null;

  readonly isOpen = computed(() => this.dialog.isOpen());
  readonly isModal = computed(() => this.dialog.modal);
  readonly role = computed(() => this.dialog.role);
  readonly dataState = computed(() => (this.isOpen() ? 'open' : 'closed'));
  readonly panelId = computed(() => `${this.dialog.dialogId}-panel`);
  readonly titleId = computed(() => `${this.dialog.dialogId}-title`);
  readonly descriptionId = computed(() => `${this.dialog.dialogId}-description`);

  constructor() {
    // React to open/close state changes
    effect(() => {
      if (this.isOpen()) {
        this.onOpen();
      } else {
        this.onClose();
      }
    });
  }

  ngOnDestroy(): void {
    this.onClose();
  }

  private onOpen(): void {
    if (this.dialog.modal) {
      ScrollLock.lock();
    }

    // Initialize focus trap once the element is visible
    // (hidden attribute is removed by the host binding before this runs)
    Promise.resolve().then(() => {
      this.focusTrap = new FocusTrap(this.el.nativeElement);
      this.focusTrap.activate();
    });
  }

  private onClose(): void {
    this.focusTrap?.deactivate();
    this.focusTrap = null;

    if (this.dialog.modal) {
      ScrollLock.unlock();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.dialog.closeOnEscape) {
      event.stopPropagation(); // Prevent parent dialogs from also closing
      this.dialog.closeDialog();
    }
  }
}
