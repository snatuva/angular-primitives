import {
    Directive,
    ElementRef,
    HostListener,
    inject,
} from '@angular/core';
import { TooltipState } from './tooltip.state';

@Directive({
    selector: '[apTooltipTrigger]',
    standalone: true,
    host: {
        '(mouseenter)': 'onMouseEnter()',
        '(mouseleave)': 'onMouseLeave()',
        '(focus)': 'onFocus()',
        '(blur)': 'onBlur()',
    }
})
export class TooltipTriggerDirective {
    private readonly state = inject(TooltipState);
    readonly element = inject(ElementRef<HTMLElement>);

    onMouseEnter() {
        this.state.openTooltip();
    }

    onMouseLeave() {
        this.state.closeTooltip();
    }

    onFocus() {
        this.state.openTooltip();
    }

    onBlur() {
        this.state.closeTooltip();
    }
}

