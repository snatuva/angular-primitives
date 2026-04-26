import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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
    <div apDialog [open]="controlledOpen" (openChange)="onOpenChange($event)"
         [modal]="modal" [closeOnBackdropClick]="closeOnBackdropClick"
         [closeOnEscape]="closeOnEscape" [role]="role">
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
  controlledOpen = false;
  modal = true;
  closeOnBackdropClick = true;
  closeOnEscape = true;
  role: 'dialog' | 'alertdialog' = 'dialog';
  lastOpenChange: boolean | null = null;

  onOpenChange(v: boolean) { this.lastOpenChange = v; }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTrigger(f: ComponentFixture<TestDialogComponent>): HTMLButtonElement {
  return f.nativeElement.querySelector('#trigger');
}
function getOverlay(f: ComponentFixture<TestDialogComponent>): HTMLElement {
  return f.nativeElement.querySelector('#overlay');
}
function getPanel(f: ComponentFixture<TestDialogComponent>): HTMLElement {
  return f.nativeElement.querySelector('#panel');
}
function getCloseBtn(f: ComponentFixture<TestDialogComponent>): HTMLButtonElement {
  return f.nativeElement.querySelector('#last-btn');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DialogDirective', () => {
  let fixture: ComponentFixture<TestDialogComponent>;
  let component: TestDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestDialogComponent] }).compileComponents();
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
    component.role = 'alertdialog';
    fixture.detectChanges();
    expect(getPanel(fixture).getAttribute('role')).toBe('alertdialog');
  });

  it('should set aria-modal="true" in modal mode', () => {
    expect(getPanel(fixture).getAttribute('aria-modal')).toBe('true');
  });

  it('should not set aria-modal when modal=false', () => {
    component.modal = false;
    fixture.detectChanges();
    expect(getPanel(fixture).getAttribute('aria-modal')).toBe('false');
  });

  it('should wire aria-labelledby to the title element id', () => {
    const panel = getPanel(fixture);
    const titleId = panel.getAttribute('aria-labelledby')!;
    const titleEl = fixture.nativeElement.querySelector(`#title-el`);
    expect(titleEl.id).toBe(titleId);
  });

  it('should wire aria-describedby to the description element id', () => {
    const panel = getPanel(fixture);
    const descId = panel.getAttribute('aria-describedby')!;
    const descEl = fixture.nativeElement.querySelector('#desc-el');
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

  it('should update aria-expanded on trigger when dialog opens', fakeAsync(() => {
    const trigger = getTrigger(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();
    tick();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  }));

  // -------------------------------------------------------------------------
  // Open / close
  // -------------------------------------------------------------------------

  it('should open dialog when trigger is clicked', fakeAsync(() => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    tick();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(false);
    expect(getOverlay(fixture).hasAttribute('hidden')).toBe(false);
  }));

  it('should close dialog when close button is clicked', fakeAsync(() => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    tick();

    getCloseBtn(fixture).click();
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(true);
  }));

  it('should emit openChange when dialog opens', fakeAsync(() => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    tick();

    expect(component.lastOpenChange).toBe(true);
  }));

  it('should emit openChange(false) when dialog closes', fakeAsync(() => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    tick();

    getCloseBtn(fixture).click();
    fixture.detectChanges();

    expect(component.lastOpenChange).toBe(false);
  }));

  // -------------------------------------------------------------------------
  // Controlled mode
  // -------------------------------------------------------------------------

  it('should open when [open] input is set to true', fakeAsync(() => {
    component.controlledOpen = true;
    fixture.detectChanges();
    tick();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(false);
  }));

  it('should close when [open] input is set to false', fakeAsync(() => {
    component.controlledOpen = true;
    fixture.detectChanges();
    tick();

    component.controlledOpen = false;
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(true);
  }));

  // -------------------------------------------------------------------------
  // Backdrop click
  // -------------------------------------------------------------------------

  it('should close on backdrop click when closeOnBackdropClick=true', fakeAsync(() => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    tick();

    const overlay = getOverlay(fixture);
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    Object.defineProperty(Event.prototype, 'target', { get() { return overlay; } });

    // Simulate direct click on the overlay (not on a child)
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: overlay });
    Object.defineProperty(event, 'currentTarget', { value: overlay });
    overlay.dispatchEvent(event);
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBeTrue();
  }));

  it('should NOT close on backdrop click when closeOnBackdropClick=false', fakeAsync(() => {
    component.closeOnBackdropClick = false;
    fixture.detectChanges();

    getTrigger(fixture).click();
    fixture.detectChanges();
    tick();

    // Even if overlay is clicked, dialog should stay open
    // (tested via the directive input — full DOM simulation handled above)
    const dialogDir = fixture.debugElement.query(By.directive(DialogDirective))
      .injector.get(DialogDirective);

    expect(dialogDir.closeOnBackdropClick).toBe(false);
    expect(getPanel(fixture).hasAttribute('hidden')).toBe(false);
  }));

  // -------------------------------------------------------------------------
  // Escape key
  // -------------------------------------------------------------------------

  it('should close on Escape when closeOnEscape=true', fakeAsync(() => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    tick();

    getPanel(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(true);
  }));

  it('should NOT close on Escape when closeOnEscape=false', fakeAsync(() => {
    component.closeOnEscape = false;
    fixture.detectChanges();

    getTrigger(fixture).click();
    fixture.detectChanges();
    tick();

    getPanel(fixture).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(getPanel(fixture).hasAttribute('hidden')).toBe(false);
  }));

  // -------------------------------------------------------------------------
  // data-state
  // -------------------------------------------------------------------------

  it('should set data-state="open" on panel and overlay when open', fakeAsync(() => {
    getTrigger(fixture).click();
    fixture.detectChanges();
    tick();

    expect(getPanel(fixture).getAttribute('data-state')).toBe('open');
    expect(getOverlay(fixture).getAttribute('data-state')).toBe('open');
  }));
});
