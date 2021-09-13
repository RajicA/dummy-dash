import { Folder } from '../models/folder.model';
import { Project } from '../models/project.model';
import { UtilsService } from './utils.service';

export class LayoutService {

  projectSelector = '.project';
  folderSelector = '.folder';
  checkboxLabelSelector = '.project label';

  private utilsService: UtilsService;

  constructor() {
    this.utilsService = new UtilsService();
  }

  createFolders(folders: Folder[]): void {
    folders = this.utilsService.sortFolders(folders);

    const sideBarEl = document.getElementsByClassName('sidebar')[0];

    folders.forEach((folder: Folder) => {
      const folderEl = document.createElement('div');
      folderEl.id = `folder${folder.order}`;
      folderEl.classList.add('folder');
      folderEl.innerText = folder.name;
      sideBarEl.appendChild(folderEl);
    });
  }

  createProjects(projects: Project[]): void {
    const gridEl = document.getElementsByClassName('grid')[0];
    gridEl.innerHTML = '';

    projects.forEach((project: Project) => {
      const gridItemEl = document.createElement('div');
      gridItemEl.classList.add('grid__item');

      const projectEl = document.createElement('div');
      projectEl.id = `project${project.order}`;
      projectEl.classList.add('project');

      const inputEl = document.createElement('input');
      inputEl.id = project.order.toString();
      inputEl.type = 'checkbox';

      const labelEl = document.createElement('label');
      labelEl.setAttribute('for', inputEl.id);

      const circleEl = document.createElement('span');
      circleEl.classList.add('circle');

      const numberEl = document.createElement('span');
      numberEl.classList.add('number');
      numberEl.innerText = project.name;

      projectEl.appendChild(inputEl);
      projectEl.appendChild(labelEl);
      projectEl.appendChild(circleEl);
      projectEl.appendChild(numberEl);

      gridItemEl.appendChild(projectEl);
      gridEl.appendChild(gridItemEl);
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
    document.dispatchEvent(new CustomEvent('DD_FOLDER_CHANGED', { detail: { folderEl: el } }));
  }

  handleProjectClick(ev: MouseEvent): void {
    const el = ev.target as HTMLElement;
    const projectEl: HTMLElement = el.closest(this.projectSelector);
    document.dispatchEvent(new CustomEvent('DD_PROJECT_SELECTED', { detail: { projectEl } }));
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
}
