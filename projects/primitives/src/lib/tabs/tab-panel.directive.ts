import { Directive, OnInit, OnDestroy, inject, Input } from '@angular/core';
import { TabsState } from './tabs.state';
import { TabPanel } from '@angular/aria/tabs';

@Directive({
    selector: '[apTabPanel]',
    standalone: true,
    exportAs: 'apTabPanel',
    host: {
        'role': 'tabpanel',
        '[attr.aria-labelledby]': '`ap-tab-${ariaPanel.value()}`',
        '[attr.id]': '`ap-panel-${ariaPanel.value()}`',
        '[style.display]': 'isActive() ? "block" : "none"',
        '[hidden]': '!isActive()'
    },
    hostDirectives: [{
        directive: TabPanel,
        // We map the public "id" attribute of your directive 
        // to the "value" property of the TabPanel primitive.
        inputs: ['id', 'value']
    }]
})
export class TabPanelDirective implements OnInit, OnDestroy {
    // 1. Inject the host directive instance
    protected ariaPanel = inject(TabPanel);

    @Input() disabled = false;
    private state = inject(TabsState);

    ngOnInit(): void {
        // 2. Use ariaPanel.value (which holds the 'id' passed by the user)
        this.state.register({
            id: this.ariaPanel.value() as string,
            disabled: this.disabled
        });
    }

    ngOnDestroy(): void {
        this.state.unregister(this.ariaPanel.value() as string);
    }

    isActive(): boolean {
        return this.state.activeId() === this.ariaPanel.value();
    }

    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            event.stopPropagation();
        }
    }
}