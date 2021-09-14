import { Events } from '../constants/events.enum';
import { LayoutService } from './layout.service';

export class DragAndDropService {

  layoutService: LayoutService = new LayoutService();

  handleDragStart(ev: DragEvent): void {
    document.dispatchEvent(new CustomEvent(Events.DD_DRAG, { detail: { srcEv: ev } }));
  }

  handleDragEnd(ev: DragEvent): void {
    this.layoutService.removeGhostDragEl();
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

  addDragAndDropEventListeners(folderSelector: string, projectSelector: string): void {
    const folders = document.querySelectorAll(folderSelector);
    const projects = document.querySelectorAll(projectSelector);

    projects.forEach((project: HTMLElement) => {
      project.addEventListener('dragstart', this.handleDragStart.bind(this), false);
      project.addEventListener('dragend', this.handleDragEnd.bind(this), false);
    });

    folders.forEach((folder: HTMLElement) => {
      if (folder.id !== 'allFolders') {
        folder.addEventListener('dragenter', this.handleDragEnter.bind(this), false);
        folder.addEventListener('dragover', this.handleDragOver.bind(this), false);
        folder.addEventListener('dragleave', this.handleDragLeave.bind(this), false);
        folder.addEventListener('drop', this.handleDrop.bind(this), false);
      }
    });
  }

}
