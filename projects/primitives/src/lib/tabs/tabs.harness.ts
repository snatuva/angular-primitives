import { ComponentHarness } from '@angular/cdk/testing';

export class TabTriggerHarness extends ComponentHarness {
    static hostSelector = '[apTabTrigger]';

    async getText(): Promise<string> {
        return (await this.host()).text();
    }

    async isActive(): Promise<boolean> {
        const host = await this.host();
        const ariaSelected = await host.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async click(): Promise<void> {
        const host = await this.host();
        return host.click();
    }

    async getTabId(): Promise<string | null> {
        const host = await this.host();
        return host.getAttribute('tabId');
    }

    async isDisabled(): Promise<boolean> {
        const host = await this.host();
        const ariaDisabled = await host.getAttribute('aria-disabled');
        return ariaDisabled === 'true';
    }
}

export class TabPanelHarness extends ComponentHarness {
    static hostSelector = '[apTabPanel]';

    async getText(): Promise<string> {
        return (await this.host()).text();
    }

    async isActive(): Promise<boolean> {
        const host = await this.host();
        const ariaHidden = await host.getAttribute('aria-hidden');
        return ariaHidden !== 'true';
    }

    async getRole(): Promise<string | null> {
        const host = await this.host();
        return host.getAttribute('role');
    }
}

export class TabsHarness extends ComponentHarness {
    static hostSelector = '[apTabs]';

    async getTabTriggers(): Promise<TabTriggerHarness[]> {
        return this.locatorForAll(TabTriggerHarness)();
    }

    async getTabPanels(): Promise<TabPanelHarness[]> {
        return this.locatorForAll(TabPanelHarness)();
    }

    async getActiveTab(): Promise<TabTriggerHarness | null> {
        const triggers = await this.getTabTriggers();
        for (const trigger of triggers) {
            if (await trigger.isActive()) {
                return trigger;
            }
        }
        return null;
    }

    async selectTabByText(text: string): Promise<void> {
        const triggers = await this.getTabTriggers();
        for (const trigger of triggers) {
            if ((await trigger.getText()) === text) {
                await trigger.click();
                return;
            }
        }
        throw new Error(`Tab with text "${text}" not found`);
    }

    async selectTabByIndex(index: number): Promise<void> {
        const triggers = await this.getTabTriggers();
        if (index < 0 || index >= triggers.length) {
            throw new Error(`Tab index ${index} out of range`);
        }
        await triggers[index].click();
    }
}