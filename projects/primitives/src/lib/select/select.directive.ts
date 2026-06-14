import { Directive, input, output, effect, inject, OnDestroy } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { SelectState } from './select.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * `apSelect`
 *
 * Root directive that provides select state to all child elements.
 * Manages the Overlay for the select dropdown content.
 */
@Directive({
  selector: '[apSelect]',
  standalone: true,
  exportAs: 'apSelect',
  providers: [SelectState]
})
export class SelectDirective<T> implements OnDestroy {
  private state = inject(SelectState<T>);
  private overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  /** Controlled selected value. */
  readonly value = input<T | null>(null);

  /** Default value (uncontrolled mode). */
  readonly defaultValue = input<T | null>(null);

  /** Disables the entire select component. */
  readonly disabled = input(false);

  /** Emitted when the selected value changes via user interaction. */
  readonly valueChange = output<T>();

  /** Exposes the internal listbox ID to bind to your listbox element for ARIA wiring. */
  readonly listboxId = this.state.listboxId;

  /** Exposes the open state of the dropdown. */
  readonly isOpen = this.state.isOpen;

  constructor() {
    // Sync external disabled input to state
    effect(() => {
      this.state.disabled.set(this.disabled());
    }, { allowSignalWrites: true });

    // Sync external value input to state (without emitting valueChange)
    effect(() => {
      const val = this.value();
      if (val !== undefined) {
        this.state.value.set(val as T);
      }
    }, { allowSignalWrites: true });

    // Seed default value
    effect(() => {
      const def = this.defaultValue();
      if (def !== null && this.state.value() === null) {
        this.state.value.set(def as T);
      }
    }, { allowSignalWrites: true });

    // Handle overlay attach/detach based on open state
    effect(() => {
      if (this.state.isOpen()) {
        this.showDropdown();
      } else {
        this.hideDropdown();
      }
    });

    // Listen for internal value changes and emit output
    this.state.onValueChange.pipe(takeUntilDestroyed()).subscribe(val => {
      this.valueChange.emit(val);
    });
  }

  private showDropdown(): void {
    const triggerEl = this.state.triggerElement();
    const content = this.state.contentTemplate();

    if (!triggerEl || !content || this.overlayRef) return;

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(triggerEl)
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.state.close();
    });

    const portal = new TemplatePortal(content.templateRef, content.vcr);
    this.overlayRef.attach(portal);
  }

  private hideDropdown(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  ngOnDestroy(): void {
    this.hideDropdown();
  }
}
