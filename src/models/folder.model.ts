import { Project } from './project.model';

export interface Folder {
    id: number;
    order: number;
    name: string;
    projects: Project[];
}
