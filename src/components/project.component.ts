import { Events } from '../constants/events.enum';
import { CHECKBOX_LABEL_SELECTOR, PROJECT_SELECTOR } from '../constants/selectors.const';
import { ComponentEvents } from '../models/component-events.model';
import { BaseComponent } from './base.component';

export interface ProjectComponentInput {
  id: string;
  order: number;
  name: string;
  previewMode?: boolean;
}

export class ProjectComponent extends BaseComponent implements ComponentEvents {

  constructor(private input: ProjectComponentInput) {
    super();

    this.template = `
      <section id="${this.input.id}" class="project">
        <input id="${this.input.order}" type="checkbox">
        <label for="${this.input.order}"></label>
        <span class="circle"></span>
        <span class="number">${this.input.name}</span>
      </section>
    `;

    if (input.previewMode) {
      this.applyPreviewMode();
    } else {
      this.initEvents();
    }
  }

  initEvents(): void {
    this.element.querySelector(CHECKBOX_LABEL_SELECTOR).addEventListener('click', this.handleClick.bind(this), false);
    this.element.addEventListener('dragstart', this.handleDragStart.bind(this), false);
    this.element.addEventListener('dragend', this.handleDragEnd.bind(this), false);
  }

  handleClick(event: MouseEvent): void {
    const el = (event.target as HTMLElement).closest(PROJECT_SELECTOR);
    document.dispatchEvent(new CustomEvent(Events.DD_PROJECT_SELECTED, { detail: { element: el } }));
  }

  handleDragStart(ev: DragEvent): void {
    document.dispatchEvent(new CustomEvent(Events.DD_DRAG, { detail: { srcEv: ev } }));
  }

  handleDragEnd(): void {
    document.dispatchEvent(new CustomEvent(Events.DD_DRAG_END));
  }

  applyPreviewMode(): void {
    (this.element.querySelector('input') as HTMLInputElement).disabled = true;
    (this.element.querySelector('.circle') as HTMLElement).style.display = 'none';
    (this.element.querySelector('label') as HTMLElement).style.cursor = 'default';
  }
}
