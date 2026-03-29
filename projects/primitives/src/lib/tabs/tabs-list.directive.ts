import { Directive, input } from '@angular/core';
import { TabList } from '@angular/aria/tabs';

@Directive({
    selector: '[apTabList]',
    standalone: true,
    host: {
        'role': 'tablist',
        '[attr.aria-orientation]': 'orientation()',
    },
    hostDirectives: [{
        directive: TabList
    }]
})
export class TabListDirective {
    //TODO: We can use the input() function to create a reactive input for orientation, which will automatically update the aria-orientation attribute when it changes.
    orientation = input('horizontal');
}