import { ComponentHarness } from '@angular/cdk/testing';

export class TooltipTriggerHarness extends ComponentHarness {
    static hostSelector = '[apTooltipTrigger]';

    async getAriaDescribedBy(): Promise<string | null> {
        const host = await this.host();
        return host.getAttribute('aria-describedby');
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
}

export class TooltipContentHarness extends ComponentHarness {
    static hostSelector = '[apTooltipContent]';

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

    async getContent(): Promise<TooltipContentHarness> {
        return this.locatorFor(TooltipContentHarness)();
    }

    async isOpen(): Promise<boolean> {
        // Check if content is present or visible
        try {
            const content = await this.getContent();
            return true; // If found, assume open
        } catch {
            return false;
        }
    }
}