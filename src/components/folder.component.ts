import { Events } from '../constants/events.enum';
import { ComponentEvents } from '../models/component-events.model';
import { BaseComponent } from './base.component';

export interface FolderComponentInput {
  id: string;
  name: string;
}

export class FolderComponent extends BaseComponent implements ComponentEvents {

  constructor(input: FolderComponentInput) {
    super();

    this.template = `
      <article id="${input.id}" class="folder">${input.name}</article>
    `;

    this.initEvents();
  }

  initEvents(): void {
    this.element.addEventListener('click', this.handleClick.bind(this), false);
    this.element.addEventListener('dragenter', this.handleDragEnter.bind(this), false);
    this.element.addEventListener('dragover', this.handleDragOver.bind(this), false);
    this.element.addEventListener('dragleave', this.handleDragLeave.bind(this), false);
    this.element.addEventListener('drop', this.handleDrop.bind(this), false);
  }

  handleClick(event: MouseEvent): void {
    const el = event.target as HTMLElement;
    document.dispatchEvent(new CustomEvent(Events.DD_FOLDER_CHANGED, { detail: { element: el } }));
  }

  handleDrop(ev: DragEvent): void {
    const el = ev.target as HTMLElement;
    el.classList.remove('over');
    document.dispatchEvent(new CustomEvent(Events.DD_DROP, { detail: { folderEl: el } }));
  }

  handleDragEnter(ev: DragEvent): void {
    const el = ev.target as HTMLElement;
    el.classList.add('over');
  }

  handleDragLeave(ev: DragEvent): void {
    const el = ev.target as HTMLElement;
    el.classList.remove('over');
  }

  handleDragOver(ev: DragEvent): void {
    ev.preventDefault();
  }
}
