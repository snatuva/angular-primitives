import {
  Directive,
  inject,
  computed,
  effect,
  ElementRef,
  OnDestroy,
  afterNextRender,
  Injector,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DialogDirective } from './dialog.directive';
import { ScrollLockService } from './scroll-lock.service';
import { ConfigurableFocusTrapFactory, ConfigurableFocusTrap } from '@angular/cdk/a11y';

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
  private readonly focusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private readonly scrollLockService = inject(ScrollLockService);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);

  private focusTrap: ConfigurableFocusTrap | null = null;
  private previouslyFocusedElement: HTMLElement | null = null;

  readonly isOpen = this.dialog.isOpen;
  readonly isModal = computed(() => this.dialog.modal());
  readonly role = computed(() => this.dialog.role());
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
    if (this.dialog.modal()) {
      this.scrollLockService.lock();
    }

    this.previouslyFocusedElement = this.document.activeElement as HTMLElement | null;

    // Initialize focus trap once the element is visible
    // (hidden attribute is removed by the host binding before this runs)
    Promise.resolve().then(() => {
      if (!this.isOpen()) return;
      this.focusTrap = this.focusTrapFactory.create(this.el.nativeElement);
      this.focusTrap.focusInitialElementWhenReady();
    });
  }

  private onClose(): void {
    this.focusTrap?.destroy();
    this.focusTrap = null;

    if (this.dialog.modal()) {
      this.scrollLockService.unlock();
    }
    
    if (this.previouslyFocusedElement) {
      // Defer to avoid conflicts with ongoing DOM transitions
      Promise.resolve().then(() => this.previouslyFocusedElement?.focus());
      this.previouslyFocusedElement = null;
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.dialog.closeOnEscape()) {
      event.stopPropagation(); // Prevent parent dialogs from also closing
      this.dialog.closeDialog();
    }
  }
}
