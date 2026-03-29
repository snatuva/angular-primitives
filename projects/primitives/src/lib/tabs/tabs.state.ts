import { signal, computed, Inject, Injectable } from '@angular/core';

export interface TabPanel {
    id: string;
    disabled: boolean;
}

@Injectable()
export class TabsState {
    private readonly _panels = signal<TabPanel[]>([]);
    private readonly _activeId = signal<string | null>(null);

    readonly panels = this._panels.asReadonly();
    readonly activeId = this._activeId.asReadonly();

    readonly activePanel = computed(() =>
        this._panels().find(p => p.id === this._activeId())
    );

    register(panel: TabPanel): void {
        this._panels.update(p => [...p, panel]);

        if (!this._activeId()) {
            this._activeId.set(panel.id);
        }
    }

    unregister(id: string): void {
        this._panels.update(p => p.filter(x => x.id !== id));

        if (this._activeId() === id) {
            this._activeId.set(this._panels()[0]?.id ?? null);
        }
    }

    activate(id: string): void {
        const panel = this._panels().find(p => p.id === id && !p.disabled);
        if (panel) {
            this._activeId.set(id);
        }
    }
}
