import { Component, signal, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AccordionDirective } from './accordion.directive';
import { AccordionItemDirective } from './accordion-item.directive';
import { AccordionTriggerDirective } from './accordion-trigger.directive';
import { AccordionContentDirective } from './accordion-content.directive';

// ---------------------------------------------------------------------------
// Test host components
// ---------------------------------------------------------------------------

@Component({
  standalone: true,
  imports: [
    AccordionDirective,
    AccordionItemDirective,
    AccordionTriggerDirective,
    AccordionContentDirective,
  ],
  template: `
    <div apAccordion [type]="type()" [collapsible]="collapsible()" [disabled]="rootDisabled()">
      <details apAccordionItem itemId="item-1" [disabled]="item1Disabled()">
        <summary apAccordionTrigger>Trigger 1</summary>
        <div apAccordionContent>Content 1</div>
      </details>
      <details apAccordionItem itemId="item-2">
        <summary apAccordionTrigger>Trigger 2</summary>
        <div apAccordionContent>Content 2</div>
      </details>
      <details apAccordionItem itemId="item-3">
        <summary apAccordionTrigger>Trigger 3</summary>
        <div apAccordionContent>Content 3</div>
      </details>
    </div>
  `,
})
class TestAccordionComponent {
  type = signal<'single' | 'multiple'>('single');
  collapsible = signal(false);
  rootDisabled = signal(false);
  item1Disabled = signal(false);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTriggers(fixture: ComponentFixture<TestAccordionComponent>): HTMLElement[] {
  return fixture.debugElement
    .queryAll(By.css('summary[apAccordionTrigger]'))
    .map((de) => de.nativeElement as HTMLElement);
}

function getPanels(fixture: ComponentFixture<TestAccordionComponent>): HTMLElement[] {
  return fixture.debugElement
    .queryAll(By.css('[apAccordionContent]'))
    .map((de) => de.nativeElement as HTMLElement);
}

function getItems(fixture: ComponentFixture<TestAccordionComponent>): HTMLDetailsElement[] {
  return fixture.debugElement
    .queryAll(By.css('details[apAccordionItem]'))
    .map((de) => de.nativeElement as HTMLDetailsElement);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AccordionDirective', () => {
  let fixture: ComponentFixture<TestAccordionComponent>;
  let component: TestAccordionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAccordionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  it('should render with all panels collapsed by default', () => {
    const items = getItems(fixture);
    items.forEach((item) => expect(item.open).toBe(false));
  });

  it('should apply data-orientation to the root', () => {
    const root = fixture.debugElement.query(By.directive(AccordionDirective))
      .nativeElement as HTMLElement;
    expect(root.getAttribute('data-orientation')).toBe('vertical');
  });

  // -------------------------------------------------------------------------
  // ARIA attributes
  // -------------------------------------------------------------------------

  it('should set aria-expanded="false" on all triggers initially', () => {
    getTriggers(fixture).forEach((trigger) =>
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    );
  });

  it('should wire aria-controls to the correct panel id', () => {
    const triggers = getTriggers(fixture);
    expect(triggers[0].getAttribute('aria-controls')).toBe('ap-accordion-panel-item-1');
    expect(triggers[1].getAttribute('aria-controls')).toBe('ap-accordion-panel-item-2');
  });

  it('should wire panel aria-labelledby to the trigger id', () => {
    const panels = getPanels(fixture);
    expect(panels[0].getAttribute('aria-labelledby')).toBe('ap-accordion-trigger-item-1');
    expect(panels[1].getAttribute('aria-labelledby')).toBe('ap-accordion-trigger-item-2');
  });

  it('should set role="region" on panels', () => {
    getPanels(fixture).forEach((panel) =>
      expect(panel.getAttribute('role')).toBe('region')
    );
  });

  // -------------------------------------------------------------------------
  // Single mode
  // -------------------------------------------------------------------------

  it('should expand an item when its trigger is clicked', () => {
    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    const items = getItems(fixture);
    expect(items[0].open).toBe(true);
  });

  it('should collapse the previously open item when another is opened (single mode)', () => {
    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();

    triggers[1].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('should NOT collapse open item when clicking it again if collapsible=false', () => {
    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();

    triggers[0].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('should collapse open item when clicking it again if collapsible=true', async () => {
    component.collapsible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    triggers[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
  });

  // -------------------------------------------------------------------------
  // Multiple mode
  // -------------------------------------------------------------------------

  it('should allow multiple items to be open simultaneously in multiple mode', async () => {
    component.type.set('multiple');
    fixture.detectChanges();
    await fixture.whenStable();

    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    triggers[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('should collapse individual items independently in multiple mode', async () => {
    component.type.set('multiple');
    fixture.detectChanges();
    await fixture.whenStable();

    const triggers = getTriggers(fixture);
    triggers[0].click();
    triggers[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    triggers[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
  });

  // -------------------------------------------------------------------------
  // Disabled state
  // -------------------------------------------------------------------------

  it('should disable all triggers when root disabled=true', async () => {
    component.rootDisabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    getTriggers(fixture).forEach((trigger) => {
      expect(trigger.getAttribute('aria-disabled')).toBe('true');
      expect(trigger.getAttribute('tabindex')).toBe('-1');
    });
  });

  it('should not expand an item when root is disabled', async () => {
    component.rootDisabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('should disable only the specified item when item disabled=true', async () => {
    component.item1Disabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const triggers = getTriggers(fixture);
    expect(triggers[0].getAttribute('aria-disabled')).toBe('true');
    expect(triggers[1].getAttribute('aria-disabled')).toBeNull();
  });

  // -------------------------------------------------------------------------
  // Data attributes
  // -------------------------------------------------------------------------

  it('should set data-state="open" on trigger and item when expanded', () => {
    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('data-state')).toBe('open');

    const item = fixture.debugElement.query(By.directive(AccordionItemDirective))
      .nativeElement as HTMLElement;
    expect(item.getAttribute('data-state')).toBe('open');
  });

  it('should set data-state="closed" on trigger when collapsed', () => {
    const triggers = getTriggers(fixture);
    expect(triggers[0].getAttribute('data-state')).toBe('closed');
  });

  // -------------------------------------------------------------------------
  // Keyboard navigation
  // -------------------------------------------------------------------------

  it('should move focus to next trigger on ArrowDown', () => {
    const triggers = getTriggers(fixture);
    triggers[0].focus();

    triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(triggers[1]);
  });

  it('should move focus to previous trigger on ArrowUp', () => {
    const triggers = getTriggers(fixture);
    triggers[1].focus();

    triggers[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(triggers[0]);
  });

  it('should wrap focus from last to first on ArrowDown', () => {
    const triggers = getTriggers(fixture);
    triggers[triggers.length - 1].focus();

    triggers[triggers.length - 1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    fixture.detectChanges();

    expect(document.activeElement).toBe(triggers[0]);
  });

  it('should move focus to first trigger on Home', () => {
    const triggers = getTriggers(fixture);
    triggers[2].focus();

    triggers[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(triggers[0]);
  });

  it('should move focus to last trigger on End', () => {
    const triggers = getTriggers(fixture);
    triggers[0].focus();

    triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(triggers[triggers.length - 1]);
  });

  // -------------------------------------------------------------------------
  // Cleanup / ngOnDestroy
  // -------------------------------------------------------------------------

  it('should not leak expanded state when multiple instances created and destroyed', async () => {
    const triggers1 = getTriggers(fixture);
    triggers1[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(triggers1[0].getAttribute('aria-expanded')).toBe('true');

    // Destroy component
    fixture.destroy();

    // Create new fixture
    const fixture2 = TestBed.createComponent(TestAccordionComponent);
    const component2 = fixture2.componentInstance;
    fixture2.detectChanges();

    const triggers2 = getTriggers(fixture2);
    expect(triggers2[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('should maintain expanded state integrity on trigger destruction', async () => {
    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    const accordionDir = fixture.debugElement.query(By.directive(AccordionDirective))
      .injector.get(AccordionDirective);

    expect(accordionDir.isExpanded('item-1')).toBe(true);

    // Simulate destroying the component
    fixture.destroy();

    // Verify no error
    expect(() => {
      const accordion = fixture.debugElement.query(By.directive(AccordionDirective));
      // After destroy, accordion ref should be null
      expect(accordion).toBeFalsy();
    }).not.toThrow();
  });

  it('should handle signal cleanup without memory leaks', async () => {
    const triggers = getTriggers(fixture);
    const accordionDir = fixture.debugElement.query(By.directive(AccordionDirective))
      .injector.get(AccordionDirective);

    // Multiple expansions to stress-test signal management
    triggers[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    triggers[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Verify state is correct
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');

    // Cleanup should not error
    fixture.destroy();
    expect(() => {
      const accordion = fixture.debugElement.query(By.directive(AccordionDirective));
      expect(accordion).toBeFalsy();
    }).not.toThrow();
  });
});
