import {
    Directive,
    TemplateRef,
    inject,
} from '@angular/core';

@Directive({
    selector: '[apTooltipContent]',
    standalone: true,
    host: {
        'role': 'tooltip'
    }
})
export class TooltipContentDirective {
    readonly template = inject(TemplateRef<void>);
}
