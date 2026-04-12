import { Component, DebugElement } from '@angular/core';
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
    <div apAccordion [type]="type" [collapsible]="collapsible" [disabled]="disabled">
      <div apAccordionItem itemId="item-1" [disabled]="item1Disabled">
        <button apAccordionTrigger>Trigger 1</button>
        <div apAccordionContent>Content 1</div>
      </div>
      <div apAccordionItem itemId="item-2">
        <button apAccordionTrigger>Trigger 2</button>
        <div apAccordionContent>Content 2</div>
      </div>
      <div apAccordionItem itemId="item-3">
        <button apAccordionTrigger>Trigger 3</button>
        <div apAccordionContent>Content 3</div>
      </div>
    </div>
  `,
})
class TestAccordionComponent {
  type: 'single' | 'multiple' = 'single';
  collapsible = false;
  disabled = false;
  item1Disabled = false;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTriggers(fixture: ComponentFixture<TestAccordionComponent>): HTMLButtonElement[] {
  return fixture.debugElement
    .queryAll(By.css('button[apAccordionTrigger]'))
    .map((de) => de.nativeElement as HTMLButtonElement);
}

function getPanels(fixture: ComponentFixture<TestAccordionComponent>): HTMLElement[] {
  return fixture.debugElement
    .queryAll(By.css('[apAccordionContent]'))
    .map((de) => de.nativeElement as HTMLElement);
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
    const panels = getPanels(fixture);
    panels.forEach((panel) =>
      expect(panel.getAttribute('aria-hidden')).toBe('true')
    );
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
    const panels = getPanels(fixture);
    expect(panels[0].getAttribute('aria-hidden')).toBe('false');
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

  it('should collapse open item when clicking it again if collapsible=true', () => {
    component.collapsible = true;
    fixture.detectChanges();

    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();

    triggers[0].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
  });

  // -------------------------------------------------------------------------
  // Multiple mode
  // -------------------------------------------------------------------------

  it('should allow multiple items to be open simultaneously in multiple mode', () => {
    component.type = 'multiple';
    fixture.detectChanges();

    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();
    triggers[1].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('should collapse individual items independently in multiple mode', () => {
    component.type = 'multiple';
    fixture.detectChanges();

    const triggers = getTriggers(fixture);
    triggers[0].click();
    triggers[1].click();
    fixture.detectChanges();

    triggers[0].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
  });

  // -------------------------------------------------------------------------
  // Disabled state
  // -------------------------------------------------------------------------

  it('should disable all triggers when root disabled=true', () => {
    component.disabled = true;
    fixture.detectChanges();

    getTriggers(fixture).forEach((trigger) =>
      expect(trigger.disabled).toBeTrue()
    );
  });

  it('should not expand an item when root is disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const triggers = getTriggers(fixture);
    triggers[0].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('should disable only the specified item when item disabled=true', () => {
    component.item1Disabled = true;
    fixture.detectChanges();

    const triggers = getTriggers(fixture);
    expect(triggers[0].disabled).toBeTrue();
    expect(triggers[1].disabled).toBeFalse();
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
});
