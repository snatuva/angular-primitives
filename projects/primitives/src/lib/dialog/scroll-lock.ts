/**
 * ScrollLock
 *
 * Prevents the document body from scrolling while a modal is open.
 * Handles multiple simultaneous callers (e.g. nested dialogs) using
 * a reference count — body scroll is only restored when ALL callers release.
 *
 * Also compensates for the scrollbar width to prevent layout shift.
 *
 * Usage:
 *   ScrollLock.lock();    // called by DialogContent on open
 *   ScrollLock.unlock();  // called by DialogContent on close
 */
export class ScrollLock {
  private static count = 0;
  private static originalPaddingRight = '';
  private static originalOverflow = '';

  static lock(): void {
    if (this.count === 0) {
      const scrollbarWidth = this.getScrollbarWidth();

      this.originalOverflow = document.body.style.overflow;
      this.originalPaddingRight = document.body.style.paddingRight;

      // Prevent scroll while compensating for scrollbar disappearing
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        const currentPadding = parseInt(getComputedStyle(document.body).paddingRight, 10) || 0;
        document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      }
    }
    this.count++;
  }

  static unlock(): void {
    if (this.count <= 0) return;
    this.count--;

    if (this.count === 0) {
      document.body.style.overflow = this.originalOverflow;
      document.body.style.paddingRight = this.originalPaddingRight;
    }
  }

  /** Measures the scrollbar width without adding elements to the DOM */
  private static getScrollbarWidth(): number {
    const outer = document.createElement('div');
    outer.style.cssText = 'visibility:hidden;overflow:scroll;position:absolute;top:-9999px';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const width = outer.offsetWidth - inner.offsetWidth;
    document.body.removeChild(outer);
    return width;
  }
}
