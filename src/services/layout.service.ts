import { Events } from '../constants/events.enum';
import { Folder } from '../models/folder.model';
import { Project } from '../models/project.model';
import { DepthMapService } from './depth-map.service';
import { UtilsService } from './utils.service';
import {
  PROJECT_SELECTOR,
} from '../constants/selectors.const';

import { ProjectComponent } from '../components/project.component';
import { FolderComponent } from '../components/folder.component';
import { GridItemComponent } from '../components/grid-item.component';

export class LayoutService {

  utilsService = new UtilsService();
  depthMapService = new DepthMapService();

  constructor() { }

  createFolders(folders: Folder[]): void {
    folders = this.utilsService.sortFolders(folders);

    const sideBarEl = document.getElementsByClassName('sidebar')[0];

    folders.forEach((folder: Folder) => {

      const folderEl = new FolderComponent({
        id: this.utilsService.folderIdSel(folder),
        name: folder.name,
      }).element;

      sideBarEl.appendChild(folderEl);
    });
  }

  createProjects(projects: Project[]): void {
    const gridEl = document.getElementsByClassName('grid')[0];
    gridEl.querySelectorAll('.grid__item').forEach((gridItem: HTMLElement) => gridItem.remove());

    projects.forEach((project: Project) => {
      const gridItemEl = new GridItemComponent().element;

      const projectEl = new ProjectComponent({
        id: this.utilsService.projectIdSel(project),
        order: project.order,
        name: project.name,
      }).element;

      gridItemEl.appendChild(projectEl);
      gridEl.appendChild(gridItemEl);

      if (project.image) {
        this.depthMapService.attachImage(project);
      }
    });
  }

  createGhostDragEl(selectedProjectsIds: string[]): HTMLElement {
    const dragImageEl = document.createElement('div');
    const projectsNumEl = document.createElement('span');

    dragImageEl.classList.add('drag-image');
    projectsNumEl.classList.add('drag-image__number');

    projectsNumEl.innerText = selectedProjectsIds.length.toString();

    dragImageEl.appendChild(projectsNumEl);

    let margin = selectedProjectsIds.length * 5;
    selectedProjectsIds.forEach((id: string) => {
      const projectEl = document.createElement('div');
      projectEl.style.marginTop = `${margin}px`;
      projectEl.style.marginLeft = `${margin}px`;
      dragImageEl.appendChild(projectEl);
      margin -= 5;
    });

    document.body.appendChild(dragImageEl);

    return dragImageEl;
  }

  removeGhostDragEl(): void {
    const dragImageEl = document.getElementsByClassName('drag-image')[0];
    if (dragImageEl) {
      dragImageEl.remove();
    }
  }

  removeDroppedProjects(selectedProjectsIds: string[]): void {
    selectedProjectsIds.forEach((id: string) => {
      const gridItem = document.getElementById(id).closest('.grid__item');
      gridItem.remove();
    });
  }

  handleFolderClick(ev: MouseEvent): void {
    const el = ev.target as HTMLElement;
    document.dispatchEvent(new CustomEvent(Events.DD_FOLDER_CHANGED, { detail: { folderEl: el } }));
  }

  handleProjectClick(ev: MouseEvent): void {
    const el = ev.target as HTMLElement;
    const projectEl: HTMLElement = el.closest(PROJECT_SELECTOR);
    document.dispatchEvent(new CustomEvent(Events.DD_PROJECT_SELECTED, { detail: { projectEl } }));
  }

  addFoldersEventListeners(folderSelector: string): void {
    const folders = document.querySelectorAll(folderSelector);
    folders.forEach((folder: HTMLElement) => {
      folder.addEventListener('click', this.handleFolderClick.bind(this), false);
    });
  }

  addProjectsEventListeners(checkboxLabelSelector: string): void {
    const checkboxLabels = document.querySelectorAll(checkboxLabelSelector);
    checkboxLabels.forEach((label: HTMLElement) => {
      label.addEventListener('click', this.handleProjectClick.bind(this), false);
    });
  }

  setActiveFolderClass(folderEl: HTMLElement): void {
    const folders = document.querySelectorAll('.folder');
    folders.forEach((folder: HTMLElement) => folder.classList.remove('folder--active'));
    folderEl.classList.add('folder--active');
  }

  checkIfFolderIsEmpty(projects: Project[]): void {
    const messageEl: HTMLElement = document.getElementById('empty-message');
    if (!projects.length) {
      messageEl.style.display = 'block';
    } else {
      messageEl.style.display = 'none';
    }
  }

  generatePreview(): void {
    document.querySelectorAll('.project').forEach((project: HTMLElement) => {
      const checkbox: HTMLInputElement = project.querySelector('input');
      const circle: HTMLElement = project.querySelector('.circle');
      const label: HTMLElement = project.querySelector('label');
      checkbox.disabled = true;
      circle.style.display = 'none';
      label.style.cursor = 'default';
    });
  }
}
