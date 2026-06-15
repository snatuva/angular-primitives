import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RadioGroupDirective } from './radio-group.directive';
import { RadioGroupItemDirective } from './radio-group-item.directive';

@Component({
  standalone: true,
  imports: [RadioGroupDirective, RadioGroupItemDirective],
  template: `
    <div apRadioGroup [(value)]="value" [disabled]="groupDisabled()">
      <input type="radio" apRadioGroupItem value="a" />
      <input type="radio" apRadioGroupItem value="b" [disabled]="itemBDisabled()" />
      <input type="radio" apRadioGroupItem value="c" />
    </div>
  `,
})
class TestRadioGroupComponent {
  value = signal<string | null>('a');
  groupDisabled = signal(false);
  itemBDisabled = signal(false);
}

function getRoot(fixture: ComponentFixture<TestRadioGroupComponent>): HTMLElement {
  return fixture.debugElement.query(By.directive(RadioGroupDirective))
    .nativeElement as HTMLElement;
}

function getItems(fixture: ComponentFixture<TestRadioGroupComponent>): HTMLInputElement[] {
  return fixture.debugElement
    .queryAll(By.directive(RadioGroupItemDirective))
    .map((de) => de.nativeElement as HTMLInputElement);
}

describe('RadioGroupDirective', () => {
  let fixture: ComponentFixture<TestRadioGroupComponent>;
  let component: TestRadioGroupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestRadioGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestRadioGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set role="radiogroup" on the root', () => {
    const root = getRoot(fixture);
    expect(root.getAttribute('role')).toBe('radiogroup');
  });

  it('should default type to radio on items', () => {
    getItems(fixture).forEach((item) => expect(item.getAttribute('type')).toBe('radio'));
  });

  it('should give every item the same name attribute', () => {
    const items = getItems(fixture);
    const names = items.map((item) => item.name);
    expect(new Set(names).size).toBe(1);
    expect(names[0]).toMatch(/^ap-radio-group-/);
  });

  it('should check the item matching the initial value', () => {
    const items = getItems(fixture);
    expect(items[0].checked).toBe(true);
    expect(items[1].checked).toBe(false);
    expect(items[2].checked).toBe(false);

    expect(items[0].getAttribute('data-state')).toBe('checked');
    expect(items[1].getAttribute('data-state')).toBe('unchecked');
  });

  it('should update the group value and checked items on click', () => {
    const items = getItems(fixture);

    items[2].click();
    fixture.detectChanges();

    expect(component.value()).toBe('c');
    expect(items[0].checked).toBe(false);
    expect(items[2].checked).toBe(true);
    expect(items[0].getAttribute('data-state')).toBe('unchecked');
    expect(items[2].getAttribute('data-state')).toBe('checked');
  });

  it('should reflect external changes to the value signal', () => {
    component.value.set('b');
    fixture.detectChanges();

    const items = getItems(fixture);
    expect(items[0].checked).toBe(false);
    expect(items[1].checked).toBe(true);
  });

  it('should disable all items and set data-disabled on the root when the group is disabled', () => {
    component.groupDisabled.set(true);
    fixture.detectChanges();

    const root = getRoot(fixture);
    expect(root.getAttribute('data-disabled')).toBe('true');

    getItems(fixture).forEach((item) => {
      expect(item.disabled).toBe(true);
      expect(item.getAttribute('data-disabled')).toBe('true');
    });
  });

  it('should not change the value when the group is disabled', () => {
    component.groupDisabled.set(true);
    fixture.detectChanges();

    const items = getItems(fixture);
    items[2].click();
    fixture.detectChanges();

    expect(component.value()).toBe('a');
  });

  it('should disable only the specified item when item disabled=true', () => {
    component.itemBDisabled.set(true);
    fixture.detectChanges();

    const items = getItems(fixture);
    expect(items[1].disabled).toBe(true);
    expect(items[1].getAttribute('data-disabled')).toBe('true');

    expect(items[0].disabled).toBe(false);
    expect(items[0].getAttribute('data-disabled')).toBeNull();
  });

  it('should set aria-orientation to vertical by default', () => {
    const root = getRoot(fixture);
    expect(root.getAttribute('aria-orientation')).toBe('vertical');
  });
});
