/// <reference types="vitest" />
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
);

// jsdom does not implement <dialog> behavior (showModal/show/close, the
// `open` attribute, or the `cancel`/`close` events). Polyfill the minimum
// surface so directives built on native <dialog> can be unit tested.
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.show = function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
    };

    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
    };

    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement, returnValue?: string) {
        if (!this.hasAttribute('open')) return;
        this.removeAttribute('open');
        if (returnValue !== undefined) {
            this.returnValue = returnValue;
        }
        this.dispatchEvent(new Event('close'));
    };

    Object.defineProperty(HTMLDialogElement.prototype, 'open', {
        configurable: true,
        get(this: HTMLDialogElement) {
            return this.hasAttribute('open');
        },
        set(this: HTMLDialogElement, value: boolean) {
            if (value) {
                this.setAttribute('open', '');
            } else {
                this.removeAttribute('open');
            }
        },
    });
}