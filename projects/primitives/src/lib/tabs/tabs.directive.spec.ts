import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TabsDirective } from './tabs.directive';
import { TabTriggerDirective } from './tab-trigger.directive';
import { TabPanelDirective } from './tab-panel.directive';
import { TabListDirective } from './tabs-list.directive';
import { TabsHarness } from './tabs.harness';

@Component({
    template: `
    <div apTabs>
      <div apTabList>
        <button apTabTrigger tabId="tab1">Tab 1</button>
        <button apTabTrigger tabId="tab2">Tab 2</button>
      </div>
      <section apTabPanel id="tab1" value="tab1">
        <p>Content 1</p>
      </section>
      <section apTabPanel id="tab2" value="tab2">
        <p>Content 2</p>
      </section>
    </div>
  `,
    standalone: true,
    imports: [TabsDirective, TabListDirective, TabTriggerDirective, TabPanelDirective]
})
class TestTabsComponent { }

describe('TabsDirective Accessibility', () => {
    let harness: TabsHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestTabsComponent]
        }).compileComponents();

        const fixture = TestBed.createComponent(TestTabsComponent);
        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, TabsHarness);
    });

    it('should have correct ARIA roles', async () => {
        const triggers = await harness.getTabTriggers();
        expect(triggers.length).toBe(2);

        for (const trigger of triggers) {
            expect(await trigger.getTabId()).toBeDefined();
        }

        const panels = await harness.getTabPanels();
        expect(panels.length).toBe(2);

        for (const panel of panels) {
            expect(await panel.getRole()).toBe('tabpanel');
        }
    });

    it('should handle tab selection', async () => {
        await harness.selectTabByText('Tab 2');
        const activeTab = await harness.getActiveTab();
        expect(await activeTab?.getText()).toBe('Tab 2');
    });

    it('should have aria-selected on active tab', async () => {
        const activeTab = await harness.getActiveTab();
        expect(await activeTab?.isActive()).toBe(true);
    });
});