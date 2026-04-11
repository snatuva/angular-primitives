import {
    AfterContentInit,
    contentChild,
    Directive,
    effect,
    inject,
    Injector,
    OnDestroy,
    runInInjectionContext
} from '@angular/core';
import { TooltipState } from './tooltip.state';
import { TooltipContentDirective } from './tooltip-content.directive';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';
import { Overlay } from '@angular/cdk/overlay';
import { TooltipOverlay } from './tooltip.overlay';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Directive({
    selector: '[apTooltip]',
    standalone: true,
    providers: [TooltipState],
})
export class TooltipDirective implements AfterContentInit, OnDestroy {
    state = inject(TooltipState);
    private overlay = inject(Overlay);
    private injector = inject(Injector);
    private document = inject(DOCUMENT);

    private tooltipOverlay?: TooltipOverlay;
    private destroy$ = new Subject<void>();

    contentTemplate = contentChild(TooltipContentDirective);
    trigger = contentChild(TooltipTriggerDirective);

    ngAfterContentInit() {
        const content = this.contentTemplate();
        if (content) {
            this.state.setTooltipId(content.tooltipId);
        }

        fromEvent<KeyboardEvent>(this.document, 'keydown')
            .pipe(
                filter(event => event.key === 'Escape'),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.state.closeTooltip());

        runInInjectionContext(this.injector, () => {
            effect(() => {
                const isOpen = this.state.open();
                const template = this.contentTemplate()?.templateRef;
                const triggerElement = this.trigger()?.element.nativeElement;

                // Read all signals first, then act — avoids partial reactive state
                if (isOpen && template && triggerElement) {
                    this.showTooltip();
                } else if (!isOpen) {
                    this.hideTooltip();
                }
            });
        });
    }

    private showTooltip() {
        const content = this.contentTemplate();
        const triggerElement = this.trigger()?.element.nativeElement;

        if (!content || !triggerElement) return;

        if (!this.tooltipOverlay) {
            this.tooltipOverlay = new TooltipOverlay(this.overlay, triggerElement);
        }

        this.tooltipOverlay.attach(content.templateRef, content.vcr);
        this.tooltipOverlay.setAttributes({
            role: 'tooltip',
            id: this.state.tooltipId() ?? 'tooltip'
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.tooltipOverlay?.destroy();
    }

    private hideTooltip() {
        this.tooltipOverlay?.detach();
    }
}