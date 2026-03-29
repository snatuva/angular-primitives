import { Directive, ElementRef, HostBinding, inject, Input } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { TabPanel, TabsState } from './tabs.state';
import { Tab } from '@angular/aria/tabs';

@Directive({
    selector: '[apTabTrigger]',
    standalone: true,
    host: {
        'role': 'tab',
        '[attr.aria-selected]': 'state.activeId() === tabId',
        '[attr.aria-disabled]': 'disabled',
        '[tabindex]': 'state.activeId() === tabId ? "0" : "-1"',
        '(keydown)': 'onKeydown($event)',
        '(click)': 'activate()'
    },
    providers: [
        { provide: Tab, useExisting: Tab }
    ],
    hostDirectives: [{
        directive: Tab,
        inputs: ['value: tabId']
    }]
})
export class TabTriggerDirective implements FocusableOption {
    @Input({ required: true }) tabId: string = '';
    @Input() disabled = false;
    state = inject(TabsState);
    el = inject(ElementRef<HTMLElement>);
    activate(): void {
        this.state.activate(this.tabId);
    }

    onKeydown(event: KeyboardEvent) {
        const active = this.state.panels().filter(t => !t.disabled);
        const idx = active.findIndex(t => t.id === this.tabId);
        let next: TabPanel | undefined;
        switch (event.key) {

            case 'ArrowRight':
            case 'ArrowDown':
                next = active[(idx + 1) % active.length]; break;
            case 'ArrowLeft':
            case 'ArrowUp':
                next = active[(idx - 1 + active.length) % active.length]; break;
            case 'Home': next = active[0]; break;
            case 'End': next = active[active.length - 1]; break;
        }

        if (next) {
            event.preventDefault();
            this.state.activate(next.id);
            this.focus();
        }
    }

    focus(): void {
        this.el.nativeElement.focus();
    }

    @HostBinding('attr.id')
    get id() {
        return `ap-tab-${this.tabId}`;
    }

    @HostBinding('attr.aria-controls')
    get controls() {
        return `ap-panel-${this.tabId}`;
    }
}
