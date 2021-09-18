import './styles.scss';

import Data from './assets/data.json';
import { LayoutService } from './services/layout.service';
import { Data as DataType } from './models/data.model';
import { UtilsService } from './services/utils.service';
import { Project } from './models/project.model';
import { Events } from './constants/events.enum';
import { LocalStorageService } from './services/local-storage.service';
import {
  ALL_PROJECTS_FOLDER_ID,
} from './constants/selectors.const';

export class DummyDashboard {

  activeFolderId = ALL_PROJECTS_FOLDER_ID;

  data: DataType = Data;
  selectedProjectsIds: string[] = [];

  utilsService: UtilsService = new UtilsService();
  layoutService: LayoutService = new LayoutService();
  localStorageService: LocalStorageService = new LocalStorageService();

  constructor() {
    this.getData();
    this.getActiveFolderId();
    this.renderInitialView();
    this.watchForChanges();
  }

  getData(): void {
    const data: DataType = this.localStorageService.getData();
    if (data) {
      this.data = data;
    }
  }

  getActiveFolderId(): void {
    const activeFolderId: string = this.localStorageService.getActiveFolderId();
    if (activeFolderId) {
      this.activeFolderId = activeFolderId;
    }
  }

  renderInitialView(): void {
    this.layoutService.createFolders(this.data.folders);
    this.selectFolder(document.getElementById(this.activeFolderId));
  }

  watchForChanges(): void {
    this.onFolderChanged();
    this.onProjectSelected();
    this.onDrag();
    this.onDragEnd();
    this.onDrop();
  }

  onFolderChanged(): void {
    document.addEventListener(Events.DD_FOLDER_CHANGED, (e: CustomEvent) => {
      const { element } = e.detail;
      this.selectFolder(element, true);
    });
  }

  selectFolder(folderEl: HTMLElement, clicked = false): void {
    if (folderEl.id === this.activeFolderId && clicked) {
      return;
    }

    this.activeFolderId = folderEl.id;
    this.layoutService.setActiveFolderClass(folderEl);

    const projects: Project[] = this.utilsService.getProjects(folderEl.id, this.data.folders);
    this.createProjects(projects);

    this.layoutService.checkIfFolderIsEmpty(projects);
    this.localStorageService.setActiveFolderId(this.activeFolderId);
  }

  onProjectSelected(): void {
    document.addEventListener(Events.DD_PROJECT_SELECTED, (e: CustomEvent) => {
      const { element } = e.detail;
      if (!this.selectedProjectsIds.includes(element.id)) {
        this.selectedProjectsIds.push(element.id);
        element.setAttribute('draggable', 'true');
      } else {
        this.selectedProjectsIds = this.selectedProjectsIds.filter((id: string) => id !== element.id);
        element.removeAttribute('draggable');
      }
    });
  }

  onDrop(): void {
    document.addEventListener(Events.DD_DROP, (e: CustomEvent) => {
      const { folderEl } = e.detail;

      if (folderEl.id === this.activeFolderId) {
        return;
      }

      const { current, target } = this.utilsService.getCurrentAndTarget(
        this.data,
        this.activeFolderId,
        folderEl.id,
        this.selectedProjectsIds,
      );

      this.data.folders[current.index].projects = current.projects;
      this.data.folders[target.index].projects = target.projects;

      this.layoutService.removeDroppedProjects(this.selectedProjectsIds);
      this.selectedProjectsIds = [];

      this.selectFolder(folderEl);
      this.localStorageService.setData(this.data);
    });
  }

  onDrag(): void {
    document.addEventListener(Events.DD_DRAG, (e: CustomEvent) => {
      const ghostDragEl = this.layoutService.createGhostDragEl(this.selectedProjectsIds);
      e.detail.srcEv.dataTransfer.setDragImage(ghostDragEl, 10, 80);
      const ele = document.querySelector('body') as HTMLElement;
      ele.style.overflow = 'hidden';
    });
  }

  onDragEnd(): void {
    document.addEventListener(Events.DD_DRAG_END, () => {
      this.layoutService.removeGhostDragEl();
    });
  }

  createProjects(projects: Project[]): void {
    if (this.activeFolderId === ALL_PROJECTS_FOLDER_ID) {
      this.layoutService.createProjects(projects, true);
    } else {
      this.layoutService.createProjects(projects);
    }
    this.selectedProjectsIds = [];
  }
}

const dummyDashboard = new DummyDashboard();
