import { Folder } from '../models/folder.model';
import { Project } from '../models/project.model';
import { DepthMapService } from './depth-map.service';
import { UtilsService } from './utils.service';

import { ProjectComponent } from '../components/project.component';
import { FolderComponent } from '../components/folder.component';
import { GridItemComponent } from '../components/grid-item.component';
import { ALL_PROJECTS_FOLDER_ID } from '../constants/selectors.const';
import { AllProjectsFolderComponent } from '../components/all-projects-folder.component';

export class LayoutService {

  utilsService = new UtilsService();
  depthMapService = new DepthMapService();

  constructor() { }

  createFolders(folders: Folder[]): void {
    const sideBarEl = document.getElementsByClassName('sidebar')[0];

    const allProjectsFolderEl = new AllProjectsFolderComponent({
      id: ALL_PROJECTS_FOLDER_ID,
      name: 'All projects',
    }).element;

    sideBarEl.appendChild(allProjectsFolderEl);

    folders = this.utilsService.sortFolders(folders);

    folders.forEach((folder: Folder) => {

      const folderEl = new FolderComponent({
        id: this.utilsService.folderIdSel(folder),
        name: folder.name,
      }).element;

      sideBarEl.appendChild(folderEl);
    });
  }

  createProjects(projects: Project[], previewMode = false): void {
    const gridEl = document.getElementsByClassName('grid')[0];
    gridEl.querySelectorAll('.grid__item').forEach((gridItem: HTMLElement) => gridItem.remove());

    projects.forEach((project: Project) => {
      const gridItemEl = new GridItemComponent().element;

      const projectEl = new ProjectComponent({
        id: this.utilsService.projectIdSel(project),
        order: project.order,
        name: project.name,
        previewMode,
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
}
