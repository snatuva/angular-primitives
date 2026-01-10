import { signal } from '@angular/core';

export class TooltipState {
    /** Whether tooltip is open */
    readonly open = signal(false);

    openTooltip() {
        this.open.set(true);
    }

    closeTooltip() {
        this.open.set(false);
    }

    toggle() {
        this.open.update(v => !v);
    }
}
