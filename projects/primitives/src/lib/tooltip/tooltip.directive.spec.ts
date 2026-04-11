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
class TestTooltipComponent { }

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
    const trigger = await harness.getTrigger();
    await trigger.focus();
    await new Promise(resolve => setTimeout(resolve, 400));

    // Check that tooltip content exists in document
    const tooltipElement = document.querySelector('[role="tooltip"]');
    expect(tooltipElement).toBeTruthy();
    expect(tooltipElement?.getAttribute('role')).toBe('tooltip');
  });

  it('should have unique ID on tooltip content', async () => {
    const trigger = await harness.getTrigger();
    await trigger.focus();
    await new Promise(resolve => setTimeout(resolve, 400));

    // Check that tooltip content has the expected ID
    const tooltipElement = document.querySelector('[role="tooltip"]');
    expect(tooltipElement).toBeTruthy();
    expect(tooltipElement?.getAttribute('id')).toBe('tooltip-help');
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
    await new Promise(resolve => setTimeout(resolve, 400));

    expect(await harness.isOpen()).toBe(true);
  });

  it('should have aria-expanded on trigger', async () => {
    const trigger = await harness.getTrigger();
    let ariaExpanded = await trigger.getAriaExpanded();
    expect(ariaExpanded).toBe('false');

    await trigger.focus();
    await new Promise(resolve => setTimeout(resolve, 400));

    ariaExpanded = await trigger.getAriaExpanded();
    expect(ariaExpanded).toBe('true');

    await trigger.blur();
    await new Promise(resolve => setTimeout(resolve, 200));

    ariaExpanded = await trigger.getAriaExpanded();
    expect(ariaExpanded).toBe('false');
  });

  it('should open tooltip on mouse enter', async () => {
    const trigger = await harness.getTrigger();
    await trigger.hover();

    // Give time for tooltip to open
    await new Promise(resolve => setTimeout(resolve, 400));

    expect(await harness.isOpen()).toBe(true);
  });

  it('should close tooltip on mouse leave', async () => {
    const trigger = await harness.getTrigger();
    await trigger.hover();
    await new Promise(resolve => setTimeout(resolve, 400));

    await trigger.unhover();
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(await harness.isOpen()).toBe(false);
  });

  it('should close tooltip on escape key', async () => {
    const trigger = await harness.getTrigger();
    await trigger.focus();
    await new Promise(resolve => setTimeout(resolve, 400));

    expect(await harness.isOpen()).toBe(true);

    // Simulate escape key
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(await harness.isOpen()).toBe(false);
  });

  // xit('should generate default tooltip ID if not provided', async () => {
  //   // Create a component without tooltipId
  //   @Component({
  //     template: `
  //       <div apTooltip>
  //         <button apTooltipTrigger type="button" class="tooltip-trigger-default">
  //           Help
  //         </button>
  //         <ng-template apTooltipContent>
  //           <div class="tooltip-content">
  //             Default content
  //           </div>
  //         </ng-template>
  //       </div>
  //     `,
  //     standalone: true,
  //     imports: [TooltipDirective, TooltipTriggerDirective, TooltipContentDirective]
  //   })
  //   class TestDefaultIdComponent { }

  //   await TestBed.configureTestingModule({
  //     imports: [TestDefaultIdComponent]
  //   }).compileComponents();

  //   const fixture = TestBed.createComponent(TestDefaultIdComponent);
  //   const harnessDefault = await TestbedHarnessEnvironment.harnessForFixture(fixture, TooltipHarness);

  //   const trigger = await harnessDefault.getTrigger();
  //   await trigger.focus();
  //   await new Promise(resolve => setTimeout(resolve, 400));

  //   const tooltipElement = document.querySelector('[role="tooltip"]');
  //   expect(tooltipElement).toBeTruthy();
  //   const id = tooltipElement?.getAttribute('id');
  //   expect(id).toMatch(/^ap-tooltip-/);
  // });

  // xit('should not open tooltip if no content is provided', async () => {
  //   @Component({
  //     template: `
  //       <div apTooltip>
  //         <button apTooltipTrigger type="button" class="tooltip-trigger-no-content">
  //           Help
  //         </button>
  //       </div>
  //     `,
  //     standalone: true,
  //     imports: [TooltipDirective, TooltipTriggerDirective]
  //   })
  //   class TestNoContentComponent { }

  //   await TestBed.configureTestingModule({
  //     imports: [TestNoContentComponent]
  //   }).compileComponents();

  //   const fixture = TestBed.createComponent(TestNoContentComponent);
  //   const harnessNoContent = await TestbedHarnessEnvironment.harnessForFixture(fixture, TooltipHarness);

  //   const trigger = await harnessNoContent.getTrigger();
  //   await trigger.focus();
  //   await new Promise(resolve => setTimeout(resolve, 400));

  //   expect(await harnessNoContent.isOpen()).toBe(false);
  // });
});
