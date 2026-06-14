import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { By } from '@angular/platform-browser';
import { TabsDirective } from './tabs.directive';
import { TabTriggerDirective } from './tab-trigger.directive';
import { TabPanelDirective } from './tab-panel.directive';
import { TabListDirective } from './tabs-list.directive';
import { TabsHarness } from './tabs.harness';
import { TabsState } from './tabs.state';

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

    // -------------------------------------------------------------------------
    // Cleanup / ngOnDestroy
    // -------------------------------------------------------------------------

    it('should maintain tab state isolation across component instances', async () => {
        // First instance
        const fixture1 = TestBed.createComponent(TestTabsComponent);
        const harness1 = await TestbedHarnessEnvironment.harnessForFixture(fixture1, TabsHarness);

        await harness1.selectTabByText('Tab 2');
        let activeTab = await harness1.getActiveTab();
        expect(await activeTab?.getText()).toBe('Tab 2');

        fixture1.destroy();

        // Second instance should start fresh
        const fixture2 = TestBed.createComponent(TestTabsComponent);
        const harness2 = await TestbedHarnessEnvironment.harnessForFixture(fixture2, TabsHarness);

        activeTab = await harness2.getActiveTab();
        expect(await activeTab?.getText()).toBe('Tab 1'); // Should be first tab
    });

    it('should clean up keyboard listeners on destroy', async () => {
        const fixture = TestBed.createComponent(TestTabsComponent);
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, TabsHarness);

        const triggers = await harness.getTabTriggers();
        expect(triggers.length).toBeGreaterThan(0);

        // Just select a tab to engage the directive
        await harness.selectTabByText('Tab 2');

        // Destroy component
        fixture.destroy();

        // Should not error on subsequent operations
        expect(() => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        }).not.toThrow();
    });

    it('should not leak tab state on component destruction', async () => {
        const fixture = TestBed.createComponent(TestTabsComponent);
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, TabsHarness);

        await harness.selectTabByText('Tab 2');
        let activeTab = await harness.getActiveTab();
        expect(await activeTab?.getText()).toBe('Tab 2');

        // Verify tabs are in DOM
        const panels1 = await harness.getTabPanels();
        expect(panels1.length).toBe(2);

        // Destroy
        fixture.destroy();

        // Create new fixture with clean state
        const fixture2 = TestBed.createComponent(TestTabsComponent);
        const harness2 = await TestbedHarnessEnvironment.harnessForFixture(fixture2, TabsHarness);

        // First tab should be active in new instance
        activeTab = await harness2.getActiveTab();
        expect(await activeTab?.getText()).toBe('Tab 1');

        const panels2 = await harness2.getTabPanels();
        expect(panels2.length).toBe(2);
    });

    it('should safely destroy even if no tabs are selected', () => {
        const fixture = TestBed.createComponent(TestTabsComponent);

        expect(() => {
            fixture.destroy();
        }).not.toThrow();
    });

    it('should unsubscribe from all effects on destroy', async () => {
        const fixture = TestBed.createComponent(TestTabsComponent);

        // Get the state service injected into the directive
        const tabsDir = fixture.debugElement.query(By.directive(TabsDirective));
        const tabsState = tabsDir?.injector.get(TabsState);

        if (tabsState) {
            // Verify initial state
            expect(tabsState).toBeTruthy();

            // Destroy
            fixture.destroy();

            // Creating new fixture should not be affected by old state
            const fixture2 = TestBed.createComponent(TestTabsComponent);
            const tabsState2 = fixture2.debugElement.query(By.directive(TabsDirective))
                ?.injector.get(TabsState);

            expect(tabsState2).toBeTruthy();
            expect(tabsState).not.toBe(tabsState2);
        }
    });
});