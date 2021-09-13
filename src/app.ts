import './styles.scss';
import Data from './assets/data.json';
import { LayoutService } from './services/layout.service';
import { Data as DataType } from './models/data.model';
import { Folder } from './models/folder.model';
import { UtilsService } from './services/utils.service';
import { DragAndDropService } from './services/drag-and-drop.service';
import { Project } from './models/project.model';
export class DummyDashboard {

  projectSelector = '.project';
  folderSelector = '.folder';
  checkboxLabelSelector = '.project label';

  activeFolderId = 'allFolders';

  data: DataType = Data;
  selectedProjectsIds: string[] = [];

  utilsService: UtilsService = new UtilsService();
  layoutService: LayoutService = new LayoutService();
  dragAndDropService: DragAndDropService = new DragAndDropService();

  constructor() {
    this.renderInitialView();
    this.watchForChanges();
  }

  renderInitialView(): void {
    this.layoutService.createFolders(this.data.folders);
    this.layoutService.addFoldersEventListeners(this.folderSelector);
    this.selectFolder(document.getElementById(this.activeFolderId));
  }

  watchForChanges(): void {
    this.onFolderChanged();
    this.onProjectSelected();
    this.onDrag();
    this.onDrop();
  }

  onFolderChanged(): void {
    document.addEventListener('DD_FOLDER_CHANGED', (e: CustomEvent) => {
      const { folderEl } = e.detail;
      this.selectFolder(folderEl, true);
    });
  }

  selectFolder(folderEl: HTMLElement, clicked = false): void {
    if (folderEl.id === this.activeFolderId && clicked) {
      return;
    }
    this.activeFolderId = folderEl.id;
    this.layoutService.setActiveFolderClass(folderEl);
    let projects: Project[] = [];
    if (folderEl.id === 'allFolders') {
      projects = this.utilsService.getAllProjects(this.data.folders);
    } else {
      const folder: Folder = this.utilsService.getFolderDataByIdSelector(this.data.folders, folderEl.id);
      projects = folder.projects;
    }
    projects = this.utilsService.sortProjects(projects);
    this.createProjects(projects);
  }

  onProjectSelected(): void {
    document.addEventListener('DD_PROJECT_SELECTED', (e: CustomEvent) => {
      const { projectEl } = e.detail;
      if (!this.selectedProjectsIds.includes(projectEl.id)) {
        this.selectedProjectsIds.push(projectEl.id);
        projectEl.setAttribute('draggable', 'true');
      } else {
        this.selectedProjectsIds = this.selectedProjectsIds.filter((id: string) => id !== projectEl.id);
        projectEl.removeAttribute('draggable');
      }
    });
  }

  onDrop(): void {
    document.addEventListener('DD_DROP', (e: CustomEvent) => {
      const { folderEl } = e.detail;

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
    });
  }

  onDrag(): void {
    document.addEventListener('DD_DRAG', (e: CustomEvent) => {
      const ghostDragEl = this.layoutService.createGhostDragEl(this.selectedProjectsIds);
      e.detail.srcEv.dataTransfer.setDragImage(ghostDragEl, 10, 80);
    });
  }

  createProjects(projects: Project[]): void {
    this.layoutService.createProjects(projects);
    this.layoutService.addProjectsEventListeners(this.checkboxLabelSelector);
    this.dragAndDropService.addDragAndDropEventListeners(this.folderSelector, this.projectSelector);
    this.selectedProjectsIds = [];
  }

}

const dummyDashboard = new DummyDashboard();
