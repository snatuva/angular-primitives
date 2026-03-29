import { signal } from '@angular/core';

export class TooltipState {
    readonly open = signal(false);
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
