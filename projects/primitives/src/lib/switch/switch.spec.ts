import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SwitchDirective } from './switch.directive';

@Component({
  standalone: true,
  imports: [SwitchDirective],
  template: `
    <input type="checkbox" apSwitch [(checked)]="checked" [disabled]="disabled()" />
  `,
})
class TestSwitchComponent {
  checked = signal(false);
  disabled = signal(false);
}

function getSwitch(fixture: ComponentFixture<TestSwitchComponent>): HTMLInputElement {
  return fixture.debugElement.query(By.directive(SwitchDirective))
    .nativeElement as HTMLInputElement;
}

describe('SwitchDirective', () => {
  let fixture: ComponentFixture<TestSwitchComponent>;
  let component: TestSwitchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestSwitchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set role="switch"', () => {
    const el = getSwitch(fixture);
    expect(el.getAttribute('role')).toBe('switch');
  });

  it('should default type to checkbox', () => {
    const el = getSwitch(fixture);
    expect(el.getAttribute('type')).toBe('checkbox');
  });

  it('should set aria-checked="false" and data-state="unchecked" by default', () => {
    const el = getSwitch(fixture);
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.getAttribute('data-state')).toBe('unchecked');
    expect(el.checked).toBe(false);
  });

  it('should toggle checked, aria-checked and data-state on click', () => {
    const el = getSwitch(fixture);

    el.click();
    fixture.detectChanges();

    expect(el.checked).toBe(true);
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(el.getAttribute('data-state')).toBe('checked');
    expect(component.checked()).toBe(true);
  });

  it('should reflect external changes to the checked signal', () => {
    component.checked.set(true);
    fixture.detectChanges();

    const el = getSwitch(fixture);
    expect(el.checked).toBe(true);
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(el.getAttribute('data-state')).toBe('checked');
  });

  it('should set disabled attribute and data-disabled when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    const el = getSwitch(fixture);
    expect(el.disabled).toBe(true);
    expect(el.getAttribute('data-disabled')).toBe('true');
  });

  it('should not toggle when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    const el = getSwitch(fixture);
    el.click();
    fixture.detectChanges();

    expect(el.checked).toBe(false);
    expect(component.checked()).toBe(false);
  });

  it('should not have data-disabled attribute when not disabled', () => {
    const el = getSwitch(fixture);
    expect(el.getAttribute('data-disabled')).toBeNull();
  });
});
