import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TooltipDirective } from './tooltip.directive';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';
import { TooltipContentDirective } from './tooltip-content.directive';
import { TooltipHarness } from './tooltip.harness';

@Component({
  template: `
    <div apTooltip>
      <button apTooltipTrigger type="button" class="tooltip-trigger">
        Help
      </button>

      <ng-template apTooltipContent [tooltipId]="'tooltip-help'">
        <div class="tooltip-content">
          This is helpful information.
        </div>
      </ng-template>
    </div>
  `,
  standalone: true,
  imports: [TooltipDirective, TooltipTriggerDirective, TooltipContentDirective]
})
class TestTooltipComponent {}

describe('TooltipDirective Accessibility', () => {
  let harness: TooltipHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTooltipComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(TestTooltipComponent);
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, TooltipHarness);
  });

  it('should have correct ARIA role on content', async () => {
    const content = await harness.getContent();
    expect(await content.getRole()).toBe('tooltip');
  });

  it('should have unique ID on tooltip content', async () => {
    const content = await harness.getContent();
    const id = await content.getId();
    expect(id).toBeDefined();
    expect(id).toBeTruthy();
  });

  it('should have aria-describedby on trigger', async () => {
    const trigger = await harness.getTrigger();
    const describedBy = await trigger.getAriaDescribedBy();
    expect(describedBy).toBeDefined();
  });

  it('should open tooltip on trigger focus', async () => {
    const trigger = await harness.getTrigger();
    await trigger.focus();

    // Give time for tooltip to open
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(await harness.isOpen()).toBe(true);
  });

  it('should close tooltip on trigger blur', async () => {
    const trigger = await harness.getTrigger();
    await trigger.focus();
    await new Promise(resolve => setTimeout(resolve, 100));

    await trigger.blur();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(await harness.isOpen()).toBe(false);
  });
});
