export type AccordionOrientation = 'vertical' | 'horizontal';
export type AccordionType = 'single' | 'multiple';

export interface AccordionItemState {
  id: string;
  expanded: boolean;
  disabled: boolean;
}
