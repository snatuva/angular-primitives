import { ComponentHarness } from '@angular/cdk/testing';

export class TooltipTriggerHarness extends ComponentHarness {
    static hostSelector = '[apTooltipTrigger]';

    async getAriaDescribedBy(): Promise<string | null> {
        const host = await this.host();
        return host.getAttribute('aria-describedby');
    }

    async getAriaExpanded(): Promise<string | null> {
        const host = await this.host();
        return host.getAttribute('aria-expanded');
    }

    async click(): Promise<void> {
        const host = await this.host();
        return host.click();
    }

    async focus(): Promise<void> {
        const host = await this.host();
        return host.focus();
    }

    async blur(): Promise<void> {
        const host = await this.host();
        return host.blur();
    }

    async hover(): Promise<void> {
        const host = await this.host();
        await host.hover();
    }

    async unhover(): Promise<void> {
        const host = await this.host();
        await host.mouseAway();
    }
}

export class TooltipContentHarness extends ComponentHarness {
    static hostSelector = '.tooltip-content';

    async getRole(): Promise<string | null> {
        const host = await this.host();
        return host.getAttribute('role');
    }

    async getId(): Promise<string | null> {
        const host = await this.host();
        return host.getAttribute('id');
    }

    async getText(): Promise<string> {
        return (await this.host()).text();
    }
}

export class TooltipHarness extends ComponentHarness {
    static hostSelector = '[apTooltip]';

    async getTrigger(): Promise<TooltipTriggerHarness> {
        return this.locatorFor(TooltipTriggerHarness)();
    }

    async isOpen(): Promise<boolean> {
        // Check if tooltip content exists in overlay
        try {
            const tooltipElements = document.querySelectorAll('[role="tooltip"]');
            return tooltipElements.length > 0;
        } catch {
            return false;
        }
    }
}