import { signal } from '@angular/core';

export class AccordionState {
    readonly open = signal(false);
    readonly accordionId = signal<string | null>(null);
}
