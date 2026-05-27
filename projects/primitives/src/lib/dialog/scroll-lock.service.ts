import { Injectable, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollLockService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  
  private count = 0;
  private originalPaddingRight = '';
  private originalOverflow = '';

  lock(): void {
    if (!this.isBrowser) return;

    if (this.count === 0) {
      const scrollbarWidth = this.getScrollbarWidth();

      this.originalOverflow = this.document.body.style.overflow;
      this.originalPaddingRight = this.document.body.style.paddingRight;

      this.document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        const currentPadding = parseInt(getComputedStyle(this.document.body).paddingRight, 10) || 0;
        this.document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      }
    }
    this.count++;
  }

  unlock(): void {
    if (!this.isBrowser || this.count <= 0) return;
    this.count--;

    if (this.count === 0) {
      this.document.body.style.overflow = this.originalOverflow;
      this.document.body.style.paddingRight = this.originalPaddingRight;
    }
  }

  ngOnDestroy(): void {
    if (this.count > 0) {
      this.count = 1; // Force unlock to clean up styles
      this.unlock();
    }
  }

  private getScrollbarWidth(): number {
    // A more performant way to calculate scrollbar width without forcing layout synchronously
    const windowWidth = window.innerWidth;
    const documentWidth = this.document.documentElement.clientWidth;
    return windowWidth - documentWidth;
  }
}
