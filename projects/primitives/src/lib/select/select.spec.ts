import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';

import { SelectDirective } from './select.directive';
import { SelectTriggerDirective } from './select-trigger.directive';
import { SelectContentDirective } from './select-content.directive';
import { SelectOptionDirective } from './select-option.directive';

@Component({
  standalone: true,
  imports: [SelectDirective, SelectTriggerDirective, SelectContentDirective, SelectOptionDirective],
  template: `
    <div apSelect #select="apSelect" [(value)]="selectedValue" [disabled]="disabled()">
      <button apSelectTrigger id="trigger">
        {{ selectedValue() || 'Select an option' }}
      </button>
      <ng-template apSelectContent>
        <div role="listbox" [id]="select.listboxId()" id="listbox-container">
          <div apSelectOption value="apple" id="opt-apple">Apple</div>
          <div apSelectOption value="banana" id="opt-banana" [disabled]="bananaDisabled()">Banana</div>
          <div apSelectOption value="orange" id="opt-orange">Orange</div>
        </div>
      </ng-template>
    </div>
  `
})
class TestSelectComponent {
  selectedValue = signal<string | null>(null);
  disabled = signal(false);
  bananaDisabled = signal(false);
}

describe('SelectPrimitive', () => {
  let fixture: ComponentFixture<TestSelectComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestSelectComponent]
    });
    fixture = TestBed.createComponent(TestSelectComponent);
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should apply combobox ARIA roles to trigger', () => {
    const trigger = fixture.debugElement.query(By.css('#trigger')).nativeElement;
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('should open dropdown on trigger click', () => {
    const trigger = fixture.debugElement.query(By.css('#trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const listbox = overlayContainerElement.querySelector('[role="listbox"]');
    expect(listbox).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should select an option and close the dropdown', () => {
    const trigger = fixture.debugElement.query(By.css('#trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const appleOpt = overlayContainerElement.querySelector('#opt-apple') as HTMLElement;
    expect(appleOpt.getAttribute('role')).toBe('option');
    expect(appleOpt.getAttribute('aria-selected')).toBe('false');

    appleOpt.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedValue()).toBe('apple');
    expect(overlayContainerElement.querySelector('[role="listbox"]')).toBeFalsy();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should navigate options with keyboard arrows', () => {
    const trigger = fixture.debugElement.query(By.css('#trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    // Trigger ArrowDown
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const activeId = trigger.getAttribute('aria-activedescendant');
    expect(activeId).toBeTruthy();

    const activeOption = overlayContainerElement.querySelector(`#${activeId}`) as HTMLElement;
    
    // In our logic, opening defaults to the first item (apple).
    // Arrow down moves to the second item (banana).
    expect(activeOption.id).toBe('opt-banana');

    // Trigger Enter to select the active descendant
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedValue()).toBe('banana');
  });

  it('should respect disabled state on options', () => {
    fixture.componentInstance.bananaDisabled.set(true);
    fixture.detectChanges();

    const trigger = fixture.debugElement.query(By.css('#trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const bananaOpt = overlayContainerElement.querySelector('#opt-banana') as HTMLElement;
    expect(bananaOpt.getAttribute('aria-disabled')).toBe('true');

    bananaOpt.click();
    fixture.detectChanges();

    // Should not select and should not close
    expect(fixture.componentInstance.selectedValue()).toBeNull();
    expect(overlayContainerElement.querySelector('[role="listbox"]')).toBeTruthy();
  });
  
  it('should disable entire select when root disabled is true', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const trigger = fixture.debugElement.query(By.css('#trigger')).nativeElement;
    expect(trigger.disabled).toBe(true);

    trigger.click();
    fixture.detectChanges();

    // Should not open
    expect(overlayContainerElement.querySelector('[role="listbox"]')).toBeFalsy();
  });
});
