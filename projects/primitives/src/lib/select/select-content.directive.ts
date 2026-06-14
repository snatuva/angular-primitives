import { Directive, inject, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { SelectState } from './select.state';

/**
 * `apSelectContent`
 *
 * Structural directive that provides the template for the select dropdown content.
 */
@Directive({
  selector: '[apSelectContent]',
  standalone: true
})
export class SelectContentDirective implements OnInit {
  private state = inject(SelectState);
  private templateRef = inject(TemplateRef);
  private vcr = inject(ViewContainerRef);

  ngOnInit() {
    this.state.contentTemplate.set({
      templateRef: this.templateRef,
      vcr: this.vcr
    });
  }
}
