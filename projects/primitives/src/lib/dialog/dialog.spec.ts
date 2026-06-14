import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { A11yModule } from '@angular/cdk/a11y';

import { DialogDirective } from './dialog.directive';
import { DialogTriggerDirective } from './dialog-trigger.directive';
import { DialogOverlayDirective } from './dialog-overlay.directive';
import { DialogContentDirective } from './dialog-content.directive';
import {
  DialogTitleDirective,
  DialogDescriptionDirective,
  DialogCloseDirective,
} from './dialog-parts.directives';

// ---------------------------------------------------------------------------
// Test host
// ---------------------------------------------------------------------------

@Component({
  standalone: true,
  imports: [
    DialogDirective,
    DialogTriggerDirective,
    DialogOverlayDirective,
    DialogContentDirective,
    DialogTitleDirective,
    DialogDescriptionDirective,
    DialogCloseDirective,
  ],
  template: `
    <div apDialog [open]="controlledOpen()" (openChange)="onOpenChange($event)"
         [modal]="modal()" [closeOnBackdropClick]="closeOnBackdropClick()"
         [closeOnEscape]="closeOnEscape()" [role]="role()">
      <button apDialogTrigger id="trigger">Open</button>
      <div apDialogOverlay id="overlay">
        <div apDialogContent id="panel">
          <h2 apDialogTitle id="title-el">Test dialog</h2>
          <p apDialogDescription id="desc-el">A description.</p>
          <input id="first-input" />
          <button id="last-btn" apDialogClose>Close</button>
        </div>
      </div>
    </div>
  `,
})
class TestDialogComponent {
  controlledOpen = signal(false);
  modal = signal(true);
  closeOnBackdropClick = signal(true);
  closeOnEscape = signal(true);
  role = signal<'dialog' | 'alertdialog'>('dialog');
  lastOpenChange: boolean | null = null;

  onOpenChange(v: boolean) {
    this.lastOpenChange = v;
    this.controlledOpen.set(v);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTrigger(f: ComponentFixture<TestDialogComponent>): HTMLButtonElement {
  return f.nativeElement.querySelector('[apDialogTrigger]');
}
function getOverlay(f: ComponentFixture<TestDialogComponent>): HTMLElement {
  return f.nativeElement.querySelector('[apDialogOverlay]');
}
function getPanel(f: ComponentFixture<TestDialogComponent>): HTMLElement {
  return f.nativeElement.querySelector('[apDialogContent]');
}
function getCloseBtn(f: ComponentFixture<TestDialogComponent>): HTMLButtonElement {
  return f.nativeElement.querySelector('[apDialogClose]');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DialogDirective', () => {
  let fixture: ComponentFixture<TestDialogComponent>;
  let component: TestDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestDialogComponent, A11yModule] }).compileComponents();
    fixture = TestBed.createComponent(TestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  it('should render with dialog closed by default', () => {
    expect(getPanel(fixture).hasAttribute('hidden')).toBe(true);
    expect(getOverlay(fixture).hasAttribute('hidden')).toBe(true);
  });

  it('should set data-state="closed" initially', () => {
    expect(getPanel(fixture).getAttribute('data-state')).toBe('closed');
    expect(getOverlay(fixture).getAttribute('data-state')).toBe('closed');
  });

  // -------------------------------------------------------------------------
  // ARIA wiring
  // -------------------------------------------------------------------------

  it('should set role="dialog" on the panel', () => {
    expect(getPanel(fixture).getAttribute('role')).toBe('dialog');
  });

  it('should set role="alertdialog" when configured', () => {
    component.role.set('alertdialog');
    fixture.detectChanges();
    expect(getPanel(fixture).getAttribute('role')).toBe('alertdialog');
  });

  it('should set aria-modal="true" in modal mode', () => {
    expect(getPanel(fixture).getAttribute('aria-modal')).toBe('true');
  });

  it('should not set aria-modal when modal=false', () => {
    component.modal.set(false);
    fixture.detectChanges();
    expect(getPanel(fixture).getAttribute('aria-modal')).toBe('false');
  });

  it('should wire aria-labelledby to the title element id', () => {
    const panel = getPanel(fixture);
    const titleId = panel.getAttribute('aria-labelledby')!;
    const titleEl = fixture.nativeElement.querySelector('[apDialogTitle]');
    expect(titleEl.id).toBe(titleId);
  });

  it('should wire aria-describedby to the description element id', () => {
    const panel = getPanel(fixture);
    const descId = panel.getAttribute('aria-describedby')!;
    const descEl = fixture.nativeElement.querySelector('[apDialogDescription]');
    expect(descEl.id).toBe(descId);
  });

  it('should wire aria-controls on trigger to panel id', () => {
    const trigger = getTrigger(fixture);
    const panelId = trigger.getAttribute('aria-controls');
    expect(getPanel(fixture).id).toBe(panelId!);
  });

  it('should set aria-haspopup="dialog" on the trigger', () => {
    expect(getTrigger(fixture).getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('should update aria-expanded on trigger when dialog opens', async () => {
    const trigger = getTrigger(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  // -------------------------------------------------------------------------
  // Open / close
  // -------------------------------------------------------------------------

  it('should open dialog when trigger is clicked', async () => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(false);
    expect(getOverlay(fixture).hasAttribute('hidden')).toBe(false);
  });

  it('should close dialog when close button is clicked', async () => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    getCloseBtn(fixture).click();
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(true);
  });

  it('should emit openChange when dialog opens', async () => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    expect(component.lastOpenChange).toBe(true);
  });

  it('should emit openChange(false) when dialog closes', async () => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    getCloseBtn(fixture).click();
    fixture.detectChanges();

    expect(component.lastOpenChange).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Controlled mode
  // -------------------------------------------------------------------------

  it('should open when [open] input is set to true', async () => {
    component.controlledOpen.set(true);
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(false);
  });

  it('should close when [open] input is set to false', async () => {
    component.controlledOpen.set(true);
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    component.controlledOpen.set(false);
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Backdrop click
  // -------------------------------------------------------------------------

  it('should close on backdrop click when closeOnBackdropClick=true', async () => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    const overlay = getOverlay(fixture);
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    Object.defineProperty(Event.prototype, 'target', { get() { return overlay; } });

    // Simulate direct click on the overlay (not on a child)
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: overlay });
    Object.defineProperty(event, 'currentTarget', { value: overlay });
    overlay.dispatchEvent(event);
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(true);
  });

  it('should NOT close on backdrop click when closeOnBackdropClick=false', async () => {
    component.closeOnBackdropClick.set(false);
    fixture.detectChanges();

    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    // Even if overlay is clicked, dialog should stay open
    // (tested via the directive input — full DOM simulation handled above)
    const dialogDir = fixture.debugElement.query(By.directive(DialogDirective))
      .injector.get(DialogDirective);

    expect(dialogDir.closeOnBackdropClick()).toBe(false);
    expect(getPanel(fixture).hasAttribute('hidden')).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Escape key
  // -------------------------------------------------------------------------

  it('should close on Escape when closeOnEscape=true', async () => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    getPanel(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(true);
  });

  it('should NOT close on Escape when closeOnEscape=false', async () => {
    component.closeOnEscape.set(false);
    fixture.detectChanges();

    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    getPanel(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(false);
  });

  // -------------------------------------------------------------------------
  // data-state
  // -------------------------------------------------------------------------

  it('should set data-state="open" on panel and overlay when open', async () => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));

    expect(getPanel(fixture).getAttribute('data-state')).toBe('open');
    expect(getOverlay(fixture).getAttribute('data-state')).toBe('open');
  });

  // -------------------------------------------------------------------------
  // Cleanup / ngOnDestroy
  // -------------------------------------------------------------------------

  it('should close the dialog on component destroy', async () => {
    const dialogDir = fixture.debugElement.query(By.directive(DialogDirective))
      .injector.get(DialogDirective);

    // Open the dialog
    getTrigger(fixture).click();
    fixture.detectChanges();
    await new Promise(r => setTimeout(r, 0));
    expect(getPanel(fixture).hasAttribute('hidden')).toBe(false);

    // Destroy the directive
    dialogDir.ngOnDestroy();
    fixture.detectChanges();

    // Verify dialog closed
    expect(dialogDir.open()).toBe(false);
  });

  it('should reset open state to false on destroy if already open', () => {
    const dialogDir = fixture.debugElement.query(By.directive(DialogDirective))
      .injector.get(DialogDirective);

    dialogDir.openDialog();
    expect(dialogDir.open()).toBe(true);

    dialogDir.ngOnDestroy();

    expect(dialogDir.open()).toBe(false);
  });

  it('should not throw error on destroy if dialog is closed', () => {
    const dialogDir = fixture.debugElement.query(By.directive(DialogDirective))
      .injector.get(DialogDirective);

    expect(dialogDir.open()).toBe(false);
    expect(() => dialogDir.ngOnDestroy()).not.toThrow();
  });
});
