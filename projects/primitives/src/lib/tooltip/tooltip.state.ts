import { signal } from '@angular/core';

export class TooltipState {
    /** Whether tooltip is open */
    readonly open = signal(false);
    /** ID of the tooltip content */
    readonly tooltipId = signal<string | null>(null);

    openTooltip() {
        this.open.set(true);
    }

    closeTooltip() {
        this.open.set(false);
    }

    toggle() {
        this.open.update(v => !v);
    }

    setTooltipId(id: string) {
        this.tooltipId.set(id);
    }
}
