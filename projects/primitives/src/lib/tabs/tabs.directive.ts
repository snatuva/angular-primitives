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
export class TabsDirective {
    // state = inject(TabsState);
    // public activeTab = this.state.activeId;
    // @ContentChildren(TabTriggerDirective, { descendants: true })
    // private readonly triggers!: QueryList<TabTriggerDirective>;

    // // private readonly keyboard = new TabsKeyboardController();
    // private readonly injector = inject(Injector);
    // constructor(public readonly state: TabsState) {
    // }

    // ngAfterContentInit(): void {
    //     // const triggers = this.triggers.toArray();

    //     // this.keyboard.init(triggers);

    //     // runInInjectionContext(this.injector, () => {
    //     //     effect(() => {
    //     //         const id = this.state.activeId();

    //     //         triggers.forEach(trigger =>
    //     //             trigger.setActive(trigger.tabId === id)
    //     //         );

    //     //         if (id) {
    //     //             this.keyboard.setActiveById(id);
    //     //         }
    //     //     });
    //     // });
    // }

    // // onKeydown(event: KeyboardEvent) {
    // //     this.keyboard.handleKeydown(event);
    // // }



}
