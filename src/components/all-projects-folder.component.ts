import { Events } from '../constants/events.enum';
import { ComponentEvents } from '../models/component-events.model';
import { BaseComponent } from './base.component';

export interface AllProjectsFolderComponentInput {
  id: string;
  name: string;
}

export class AllProjectsFolderComponent extends BaseComponent implements ComponentEvents {

  constructor(input: AllProjectsFolderComponentInput) {
    super();

    this.template = `
      <article id="${input.id}" class="folder">${input.name}</article>
    `;

    this.initEvents();
  }

  initEvents(): void {
    this.element.addEventListener('click', this.handleClick.bind(this), false);
  }

  handleClick(event: MouseEvent): void {
    const el = event.target as HTMLElement;
    document.dispatchEvent(new CustomEvent(Events.DD_FOLDER_CHANGED, { detail: { element: el } }));
  }
}
