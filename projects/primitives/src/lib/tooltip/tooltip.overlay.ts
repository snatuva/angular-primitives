import {
    Overlay,
    OverlayRef
} from '@angular/cdk/overlay';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';

export class TooltipOverlay {
    private overlayRef?: OverlayRef;

    constructor(
        private readonly overlay: Overlay,
        private readonly vcr: ViewContainerRef,
        private readonly origin: HTMLElement
    ) { }

    attach(template: TemplateRef<unknown>): void {
        if (!this.overlayRef) {
            this.overlayRef = this.createOverlay();
        }

        if (!this.overlayRef.hasAttached()) {
            const portal = new TemplatePortal(template, this.vcr);
            this.overlayRef.attach(portal);
        }
    }

    detach(): void {
        this.overlayRef?.detach();
    }

    destroy(): void {
        this.overlayRef?.dispose();
    }

    keydownEvents(): Observable<KeyboardEvent> | null {
        return this.overlayRef?.keydownEvents() ?? null;
    }

    private createOverlay(): OverlayRef {
        const positionStrategy =
            this.overlay.position()
                .flexibleConnectedTo(this.origin)
                .withPositions([
                    {
                        originX: 'center',
                        originY: 'top',
                        overlayX: 'center',
                        overlayY: 'bottom',
                        offsetY: -8
                    },
                    {
                        originX: 'center',
                        originY: 'bottom',
                        overlayX: 'center',
                        overlayY: 'top',
                        offsetY: 8
                    }
                ]);

        return this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            hasBackdrop: false
        });
    }
}
