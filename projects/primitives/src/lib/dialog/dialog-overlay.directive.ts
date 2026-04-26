import {
  Directive,
  inject,
  computed,
  OnChanges,
  effect,
} from '@angular/core';
import { DialogDirective } from './dialog.directive';

/**
 * `apDialogOverlay`
 *
 * The backdrop element that sits behind the dialog panel.
 * Clicking this element closes the dialog when `closeOnBackdropClick=true`.
 *
 * Hidden when the dialog is closed (via `hidden` attribute).
 * Exposes `data-state="open|closed"` for CSS transitions.
 *
 * Typical usage: position fixed, full-viewport, semi-transparent background.
 * The library applies no styles — you control the appearance entirely.
 *
 * @example
 * <div apDialogOverlay class="overlay">
 *   <div apDialogContent>...</div>
 * </div>
 *
 * ```css
 * .overlay {
 *   position: fixed;
 *   inset: 0;
 *   background: rgba(0,0,0,0.5);
 *   display: flex;
 *   align-items: center;
 *   justify-content: center;
 * }
 * ```
 */
@Directive({
  selector: '[apDialogOverlay]',
  standalone: true,
  exportAs: 'apDialogOverlay',
  host: {
    '[attr.data-state]': 'dataState()',
    '[attr.aria-hidden]': 'true',
    '[attr.hidden]': '!isOpen() || null',
    '(click)': 'onBackdropClick($event)',
  },
})
export class DialogOverlayDirective {
  private readonly dialog = inject(DialogDirective);

  readonly isOpen = computed(() => this.dialog.isOpen());
  readonly dataState = computed(() => (this.isOpen() ? 'open' : 'closed'));

  onBackdropClick(event: MouseEvent): void {
    // Only dismiss when the click landed directly on THIS element,
    // not on child elements (i.e. the dialog panel content).
    if (
      event.target === event.currentTarget &&
      this.dialog.closeOnBackdropClick
    ) {
      this.dialog.closeDialog();
    }
  }
}
