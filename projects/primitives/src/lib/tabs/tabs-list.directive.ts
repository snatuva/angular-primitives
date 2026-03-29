import { Directive } from '@angular/core';
import { TabList } from '@angular/aria/tabs';

@Directive({
    selector: '[apTabList]',
    standalone: true,
    host: {
        'role': 'tablist'
    },
    hostDirectives: [{
        directive: TabList
    }]
})
export class TabListDirective { }