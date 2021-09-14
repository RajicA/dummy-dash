import { Data } from '../models/data.model';
import { Folder } from '../models/folder.model';
import { Project } from '../models/project.model';

export class UtilsService {

  sortFolders(folders: Folder[]): Folder[] {
    return folders.sort((a: Folder, b: Folder) => a.order - b.order);
  }

  sortProjects(projects: Project[]): Project[] {
    return projects.sort((a: Project, b: Project) => a.order - b.order);
  }

  getFolderDataByIdSelector(folders: Folder[], id: string): Folder {
    return folders.find((folder: Folder) => this.folderIdSel(folder) === id);
  }

  getAllProjects(folders: Folder[]): Project[] {
    return folders.map((folder: Folder) => folder.projects).flat();
  }

  getCurrentAndTarget(data: Data, activeFolderId: string, targetFolderId: string, selectedProjectsIds: string[]): {
    current: {
      index: number;
      projects: Project[];
    };
    target: {
      index: number;
      projects: Project[];
    };
  } {
    const currentFolder: Folder = this.getFolderDataByIdSelector(data.folders, activeFolderId);

    const selectedProjects: Project[] = currentFolder.projects.filter((project: Project) => {
      return selectedProjectsIds.includes(this.projectIdSel(project));
    });

    const targetFolder: Folder = this.getFolderDataByIdSelector(data.folders, targetFolderId);
    targetFolder.projects = targetFolder.projects.concat(selectedProjects);

    currentFolder.projects = currentFolder.projects.filter((project: Project) => {
      return !selectedProjectsIds.includes(this.projectIdSel(project));
    });

    const cIndex: number = data.folders.findIndex((folder: Folder) => folder.id === currentFolder.id);
    const tIndex: number = data.folders.findIndex((folder: Folder) => folder.id === targetFolder.id);

    return {
      current: {
        index: cIndex,
        projects: currentFolder.projects,
      },
      target: {
        index: tIndex,
        projects: targetFolder.projects,
      }
    };
  }

  folderIdSel(folder: Folder): string {
    return `folder${folder.order}`;
  }

  projectIdSel(project: Project): string {
    return `project${project.order}`;
  }
}
