import {
    Directive,
    TemplateRef,
    inject,
    Input,
} from '@angular/core';

@Directive({
    selector: '[apTooltipContent]',
    standalone: true,
    host: {
        'role': 'tooltip',
        '[id]': 'tooltipId'
    }
})
export class TooltipContentDirective {
    readonly template = inject(TemplateRef<void>);
    @Input() tooltipId: string = `ap-tooltip-${Math.random().toString(36).substr(2, 9)}`;
}
