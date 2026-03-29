import { AfterContentInit, ContentChildren, Directive, effect, HostListener, inject, Injector, QueryList, runInInjectionContext } from '@angular/core';
import { TabsState } from './tabs.state';
import { TabTriggerDirective } from './tab-trigger.directive';
// import { TabsKeyboardController } from './tabs.keyboard';
import { Tabs } from '@angular/aria/tabs';

@Directive({
    selector: '[apTabs]',
    standalone: true,
    exportAs: 'apTabs',
    providers: [
        TabsState
    ],
    hostDirectives: [{
        directive: Tabs
    }]
})
export class TabsDirective implements AfterContentInit {
    // state = inject(TabsState);
    get activeTab() { return this.state.activeId; }
    @ContentChildren(TabTriggerDirective, { descendants: true })
    private readonly triggers!: QueryList<TabTriggerDirective>;

    // private readonly keyboard = new TabsKeyboardController();
    private readonly injector = inject(Injector);
    constructor(public readonly state: TabsState) {
    }

    ngAfterContentInit(): void {
        const triggers = this.triggers.toArray();

        // this.keyboard.init(triggers);

        runInInjectionContext(this.injector, () => {
            effect(() => {
                const id = this.state.activeId();

                triggers.forEach(trigger =>
                    trigger.setActive(trigger.tabId === id)
                );

                if (id) {
                    // this.keyboard.setActiveById(id);
                }
            });
        });
    }

    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent) {
        const triggers = this.triggers.toArray();
        const currentIndex = triggers.findIndex(t => t.tabId === this.state.activeId());
        let newIndex = currentIndex;

        switch (event.key) {
            case 'ArrowLeft':
                newIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
                break;
            case 'ArrowRight':
                newIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = triggers.length - 1;
                break;
            default:
                return;
        }

        event.preventDefault();
        const targetTrigger = triggers[newIndex];
        if (targetTrigger && !targetTrigger.disabled) {
            this.state.select(targetTrigger.tabId);
            targetTrigger.focus();
        }
    }

    // // onKeydown(event: KeyboardEvent) {
    // //     this.keyboard.handleKeydown(event);
    // // }



}
