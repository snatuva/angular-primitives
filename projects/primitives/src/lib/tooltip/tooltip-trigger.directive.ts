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
        'role': 'button',
        '[attr.tabindex]': '0',
        '(mouseenter)': 'onMouseEnter()',
        '(mouseleave)': 'onMouseLeave()',
        '(focus)': 'onFocus()',
        '(blur)': 'onBlur()',
        '(keydown.escape)': 'onEscape()',
        '[attr.aria-describedby]': 'state.tooltipId()',
        '[attr.aria-expanded]': 'state.open()'
    }
})
export class TooltipTriggerDirective {
    readonly state = inject(TooltipState);
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

    onEscape() {
        this.state.closeTooltip();
    }
}

