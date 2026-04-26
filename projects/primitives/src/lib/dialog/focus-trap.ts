/**
 * FocusTrap
 *
 * Constrains Tab and Shift+Tab focus movement inside a container element.
 * When the user tabs past the last focusable element, focus wraps to the first,
 * and vice-versa. On deactivation, focus is restored to the element that was
 * active before the trap was created.
 *
 * This is a plain class — not an Angular directive — so it can be used by any
 * primitive that needs focus trapping (Dialog, Popover, Select, etc.).
 *
 * Usage:
 *   const trap = new FocusTrap(containerEl);
 *   trap.activate();
 *   // ... later ...
 *   trap.deactivate();
 */
export class FocusTrap {
  private readonly container: HTMLElement;
  private previouslyFocused: HTMLElement | null = null;
  private active = false;
  private readonly boundKeydown: (e: KeyboardEvent) => void;

  /** CSS selector for all natively focusable elements */
  private static readonly FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details > summary',
  ].join(', ');

  constructor(container: HTMLElement) {
    this.container = container;
    this.boundKeydown = this.onKeydown.bind(this);
  }

  /**
   * Activates the focus trap.
   * Saves the currently focused element and moves focus into the container.
   * If an element with `autofocus` exists inside the container, it receives
   * focus. Otherwise focus goes to the first focusable element.
   */
  activate(): void {
    if (this.active) return;
    this.active = true;

    // Save current focus so we can restore it later
    this.previouslyFocused = document.activeElement as HTMLElement | null;

    document.addEventListener('keydown', this.boundKeydown, true);

    // Defer initial focus to the next microtask so the element is fully
    // in the DOM (important when used with *ngIf or @if)
    Promise.resolve().then(() => this.focusInitial());
  }

  /**
   * Deactivates the focus trap and restores focus to the previously focused element.
   */
  deactivate(): void {
    if (!this.active) return;
    this.active = false;

    document.removeEventListener('keydown', this.boundKeydown, true);

    // Restore focus to the element that was active before the trap opened
    if (
      this.previouslyFocused &&
      typeof this.previouslyFocused.focus === 'function'
    ) {
      // Defer to avoid conflicts with ongoing DOM transitions
      Promise.resolve().then(() => this.previouslyFocused?.focus());
    }

    this.previouslyFocused = null;
  }

  private focusInitial(): void {
    // Prefer an explicit autofocus element
    const autofocus = this.container.querySelector<HTMLElement>('[autofocus]');
    if (autofocus) {
      autofocus.focus();
      return;
    }

    // Otherwise focus the first focusable element
    const first = this.getFocusable()[0];
    if (first) {
      first.focus();
    } else {
      // Last resort: make the container itself focusable and focus it
      this.container.setAttribute('tabindex', '-1');
      this.container.focus();
    }
  }

  private onKeydown(event: KeyboardEvent): void {
    if (!this.active || event.key !== 'Tab') return;

    const focusable = this.getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeEl = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift+Tab — wrap from first to last
      if (activeEl === first || !this.container.contains(activeEl)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      // Tab — wrap from last to first
      if (activeEl === last || !this.container.contains(activeEl)) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  private getFocusable(): HTMLElement[] {
    return Array.from(
      this.container.querySelectorAll<HTMLElement>(FocusTrap.FOCUSABLE_SELECTOR)
    ).filter((el) => !el.closest('[hidden]') && this.isVisible(el));
  }

  private isVisible(el: HTMLElement): boolean {
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }
}
