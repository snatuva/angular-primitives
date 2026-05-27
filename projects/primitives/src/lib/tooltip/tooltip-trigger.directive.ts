import {
    Directive,
    ElementRef,
    inject,
    input,
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

    readonly showDelay = input(300);
    readonly hideDelay = input(150);

    private showTimeout?: number;
    private hideTimeout?: number;

    onMouseEnter() {
        this.clearTimeouts();
        this.showTimeout = setTimeout(() => {
            this.state.openTooltip();
        }, this.showDelay());
    }

    onMouseLeave() {
        this.clearTimeouts();
        this.hideTimeout = setTimeout(() => {
            this.state.closeTooltip();
        }, this.hideDelay());
    }

    onFocus() {
        this.clearTimeouts();
        this.state.openTooltip();
    }

    onBlur() {
        this.clearTimeouts();
        this.hideTimeout = setTimeout(() => {
            this.state.closeTooltip();
        }, this.hideDelay());
    }

    onEscape() {
        this.clearTimeouts();
        this.state.closeTooltip();
    }

    private clearTimeouts() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = undefined;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = undefined;
        }
    }
}

