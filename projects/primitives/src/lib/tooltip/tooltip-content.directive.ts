import {
    Directive,
    TemplateRef,
    inject,
} from '@angular/core';

@Directive({
    selector: '[apTooltipContent]',
    standalone: true,
})
export class TooltipContentDirective {
    readonly template = inject(TemplateRef<void>);
}
