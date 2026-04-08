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
        private readonly origin: HTMLElement
    ) { }

    // tooltip.overlay.ts
    attach(template: TemplateRef<unknown>, vcr: ViewContainerRef): void {
        if (!this.overlayRef) {
            this.overlayRef = this.createOverlay();
        }
        if (!this.overlayRef.hasAttached()) {
            const portal = new TemplatePortal(template, vcr); // ✅ correct vcr
            this.overlayRef.attach(portal);
        }
    }

    setAttributes(attrs: Record<string, string>) {
        if (this.overlayRef) {
            const element = this.overlayRef.overlayElement;
            for (const [key, value] of Object.entries(attrs)) {
                element.setAttribute(key, value);
            }
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
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                        offsetY: -8
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                        offsetY: -8
                    },
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                        offsetY: 8
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                        offsetY: 8
                    }
                ]);

        return this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            hasBackdrop: false,
            panelClass: 'ap-tooltip-panel'
        });
    }
}
