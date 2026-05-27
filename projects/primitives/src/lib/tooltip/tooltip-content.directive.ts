import {
    Directive,
    TemplateRef,
    inject,
    input,
    ViewContainerRef,
} from '@angular/core';

@Directive({
    selector: 'ng-template[apTooltipContent]',
    standalone: true,
})
export class TooltipContentDirective {
    readonly tooltipId = input(`ap-tooltip-${Math.random().toString(36).substr(2, 9)}`);

    public templateRef = inject(TemplateRef);
    public vcr = inject(ViewContainerRef);

}
