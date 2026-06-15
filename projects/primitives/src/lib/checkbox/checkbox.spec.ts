import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CheckboxDirective } from './checkbox.directive';

@Component({
  standalone: true,
  imports: [CheckboxDirective],
  template: `
    <input
      type="checkbox"
      apCheckbox
      [(checked)]="checked"
      [indeterminate]="indeterminate()"
      [disabled]="disabled()"
    />
  `,
})
class TestCheckboxComponent {
  checked = signal(false);
  indeterminate = signal(false);
  disabled = signal(false);
}

function getCheckbox(fixture: ComponentFixture<TestCheckboxComponent>): HTMLInputElement {
  return fixture.debugElement.query(By.directive(CheckboxDirective))
    .nativeElement as HTMLInputElement;
}

describe('CheckboxDirective', () => {
  let fixture: ComponentFixture<TestCheckboxComponent>;
  let component: TestCheckboxComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should default type to checkbox', () => {
    const el = getCheckbox(fixture);
    expect(el.getAttribute('type')).toBe('checkbox');
  });

  it('should set data-state="unchecked" by default', () => {
    const el = getCheckbox(fixture);
    expect(el.checked).toBe(false);
    expect(el.indeterminate).toBe(false);
    expect(el.getAttribute('data-state')).toBe('unchecked');
  });

  it('should toggle checked and data-state on click', () => {
    const el = getCheckbox(fixture);

    el.click();
    fixture.detectChanges();

    expect(el.checked).toBe(true);
    expect(el.getAttribute('data-state')).toBe('checked');
    expect(component.checked()).toBe(true);
  });

  it('should reflect external changes to the checked signal', () => {
    component.checked.set(true);
    fixture.detectChanges();

    const el = getCheckbox(fixture);
    expect(el.checked).toBe(true);
    expect(el.getAttribute('data-state')).toBe('checked');
  });

  it('should set the indeterminate DOM property when indeterminate is true', () => {
    component.indeterminate.set(true);
    fixture.detectChanges();

    const el = getCheckbox(fixture);
    expect(el.indeterminate).toBe(true);
    expect(el.getAttribute('data-state')).toBe('indeterminate');
  });

  it('should prioritize indeterminate over checked in data-state', () => {
    component.checked.set(true);
    component.indeterminate.set(true);
    fixture.detectChanges();

    const el = getCheckbox(fixture);
    expect(el.getAttribute('data-state')).toBe('indeterminate');
  });

  it('should clear indeterminate when set back to false', () => {
    component.indeterminate.set(true);
    fixture.detectChanges();

    component.indeterminate.set(false);
    fixture.detectChanges();

    const el = getCheckbox(fixture);
    expect(el.indeterminate).toBe(false);
    expect(el.getAttribute('data-state')).toBe('unchecked');
  });

  it('should set disabled attribute and data-disabled when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    const el = getCheckbox(fixture);
    expect(el.disabled).toBe(true);
    expect(el.getAttribute('data-disabled')).toBe('true');
  });

  it('should not toggle when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    const el = getCheckbox(fixture);
    el.click();
    fixture.detectChanges();

    expect(el.checked).toBe(false);
    expect(component.checked()).toBe(false);
  });
});
