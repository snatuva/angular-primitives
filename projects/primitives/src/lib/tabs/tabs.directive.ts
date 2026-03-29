import { AfterContentInit, ContentChildren, Directive, effect, HostListener, inject, Injector, QueryList, runInInjectionContext } from '@angular/core';
import { TabsState } from './tabs.state';
import { TabTriggerDirective } from './tab-trigger.directive';
// import { TabsKeyboardController } from './tabs.keyboard';
import { Tabs } from '@angular/aria/tabs';

export type SelectionMode = 'follow' | 'explicit';

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
export class TabsDirective { }
