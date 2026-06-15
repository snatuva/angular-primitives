import { Component, signal } from '@angular/core';
import {
  DialogDirective,
  DialogTriggerDirective,
  DialogContentDirective,
  DialogTitleDirective,
  DialogDescriptionDirective,
  DialogCloseDirective,
} from './index';

const DIALOG_IMPORTS = [
  DialogDirective,
  DialogTriggerDirective,
  DialogContentDirective,
  DialogTitleDirective,
  DialogDescriptionDirective,
  DialogCloseDirective,
];

// ---------------------------------------------------------------------------
// Example 1 — Basic modal dialog (uncontrolled)
// ---------------------------------------------------------------------------

/**
 * The simplest possible usage. `apDialogContent` goes directly on a native
 * `<dialog>` element — the browser handles the top layer, focus trap, and
 * focus restoration. Style the `::backdrop` and panel however you like.
 */
@Component({
  selector: 'app-basic-dialog',
  standalone: true,
  imports: DIALOG_IMPORTS,
  styles: [`
    .panel {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      width: min(480px, calc(100vw - 2rem));
      border: none;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
    .panel::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }
    .panel h2 { margin: 0 0 0.5rem; font-size: 1.125rem; }
    .panel p  { margin: 0 0 1.5rem; color: #555; font-size: 0.9375rem; }
    .actions  { display: flex; gap: 0.75rem; justify-content: flex-end; }

    /* Animate open/close with data-state */
    .panel[data-state="open"] { animation: slideUp 200ms ease; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
  `],
  template: `
    <div apDialog>
      <button apDialogTrigger>Open dialog</button>

      <dialog apDialogContent class="panel">
        <h2 apDialogTitle>Edit profile</h2>
        <p apDialogDescription>Update your display name and bio.</p>

        <label>
          Name
          <input type="text" value="Siva Natuva" />
        </label>

        <div class="actions">
          <button apDialogClose>Cancel</button>
          <button apDialogClose>Save changes</button>
        </div>
      </dialog>
    </div>
  `,
})
export class BasicDialogComponent {}


// ---------------------------------------------------------------------------
// Example 2 — Confirmation / alertdialog (destructive action)
// ---------------------------------------------------------------------------

/**
 * Use role="alertdialog" for destructive actions.
 * Screen readers announce alertdialog panels with higher urgency.
 * The first focusable element should be the Cancel (non-destructive) button.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: DIALOG_IMPORTS,
  template: `
    <div apDialog role="alertdialog" [closeOnBackdropClick]="false">
      <button apDialogTrigger>Delete account</button>

      <dialog apDialogContent class="panel">
        <h2 apDialogTitle>Delete account?</h2>
        <p apDialogDescription>
          This will permanently delete your account and all associated data.
          This action cannot be undone.
        </p>

        <div class="actions">
          <!-- Cancel is first — receives focus, safer default -->
          <button apDialogClose autofocus>Cancel</button>
          <button (click)="onConfirmDelete()">Delete account</button>
        </div>
      </dialog>
    </div>
  `,
})
export class ConfirmDialogComponent {
  onConfirmDelete(): void {
    console.log('Account deleted');
  }
}


// ---------------------------------------------------------------------------
// Example 3 — Controlled dialog (parent owns state)
// ---------------------------------------------------------------------------

/**
 * Useful when you need to open/close the dialog programmatically
 * based on external logic (form submission, route events, etc.)
 */
@Component({
  selector: 'app-controlled-dialog',
  standalone: true,
  imports: DIALOG_IMPORTS,
  template: `
    <!-- External controls -->
    <button (click)="open.set(true)">Open programmatically</button>
    <span>Dialog is: {{ open() ? 'open' : 'closed' }}</span>

    <div apDialog [(open)]="open" (openChange)="onOpenChange($event)">
      <!-- Trigger is optional in controlled mode — you might open it externally -->
      <button apDialogTrigger>Open via trigger</button>

      <dialog apDialogContent class="panel">
        <h2 apDialogTitle>Controlled dialog</h2>
        <p apDialogDescription>This dialog's state is managed by the parent component.</p>
        <button apDialogClose>Close</button>
      </dialog>
    </div>
  `,
})
export class ControlledDialogComponent {
  readonly open = signal(false);

  onOpenChange(isOpen: boolean): void {
    this.open.set(isOpen);
    if (!isOpen) {
      console.log('Dialog closed — run cleanup here');
    }
  }
}


// ---------------------------------------------------------------------------
// Example 4 — Non-modal dialog (panel without backdrop)
// ---------------------------------------------------------------------------

/**
 * Set modal=false to use the native `.show()` instead of `.showModal()`.
 * Focus is NOT trapped, no backdrop is rendered, and the rest of the page
 * stays interactive. Useful for side panels, help drawers, or contextual
 * information panels.
 */
@Component({
  selector: 'app-non-modal-dialog',
  standalone: true,
  imports: DIALOG_IMPORTS,
  styles: [`
    .side-panel {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: 360px;
      margin: 0;
      background: white;
      border: none;
      border-left: 1px solid #e2e8f0;
      padding: 1.5rem;
      box-shadow: -4px 0 24px rgba(0,0,0,0.08);
    }
  `],
  template: `
    <div apDialog [modal]="false">
      <button apDialogTrigger>Open help panel</button>

      <dialog apDialogContent class="side-panel">
        <h2 apDialogTitle>Help</h2>
        <p>Here is some contextual help content.</p>
        <button apDialogClose>Close panel</button>
      </dialog>
    </div>
  `,
})
export class NonModalDialogComponent {}
