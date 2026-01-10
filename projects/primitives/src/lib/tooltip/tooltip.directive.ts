import {
    AfterContentInit,
    ContentChild,
    contentChild,
    contentChildren,
    Directive,
    effect,
    inject,
    Injector,
    OnDestroy,
    runInInjectionContext,
    ViewContainerRef,
} from '@angular/core';
import { TooltipState } from './tooltip.state';
import { TooltipContentDirective } from './tooltip-content.directive';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';
import { Overlay } from '@angular/cdk/overlay';
import { TooltipOverlay } from './tooltip.overlay';

@Directive({
    selector: '[apTooltip]',
    standalone: true,
    providers: [TooltipState],
})
export class TooltipDirective implements AfterContentInit, OnDestroy {
    state = inject(TooltipState);

    // Use decorator for single query
    @ContentChild(TooltipContentDirective)
    content!: TooltipContentDirective;

    // Use signal for multiple
    readonly triggers = contentChildren(TooltipTriggerDirective);

    private overlay: TooltipOverlay | null = null;

    private readonly overlayService = inject(Overlay);
    private readonly vcr = inject(ViewContainerRef);
    private readonly injector = inject(Injector);

    ngAfterContentInit(): void {
        runInInjectionContext(this.injector, () => {
            effect(() => {
                const content = this.content;
                const triggers = this.triggers();

                // Early return if required elements are missing
                if (!content || triggers.length === 0) {
                    return;
                }

                // Create overlay only once
                if (!this.overlay) {
                    const origin = triggers[0].element.nativeElement;
                    this.overlay = new TooltipOverlay(
                        this.overlayService,
                        this.vcr,
                        origin
                    );
                }

                // Toggle tooltip visibility
                if (this.state.open()) {
                    this.showTooltip(content);
                } else {
                    this.hideTooltip();
                }
            });
        });
    }

    private showTooltip(content: TooltipContentDirective): void {
        if (!this.overlay) return;

        // Clear any existing content
        this.vcr.clear();

        // Create and attach the tooltip content
        this.vcr.createEmbeddedView(content.template);
        // this.overlay.attach(viewRef);
    }

    private hideTooltip(): void {
        this.vcr.clear();
        this.overlay?.detach();
    }

    ngOnDestroy(): void {
        this.vcr.clear();
        this.overlay?.destroy();
        this.overlay = null;
    }
}