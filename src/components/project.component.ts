import { BaseComponent } from './base.component';

export interface ProjectComponentInput {
  id: string;
  order: number;
  name: string;
}

export class ProjectComponent extends BaseComponent<ProjectComponentInput>  {

  constructor(input: ProjectComponentInput) {
    super(input);

    this.template(`
      <div id="{{id}}" class="project">
        <input id="{{order}}" type="checkbox">
        <label for="{{order}}"></label>
        <span class="circle"></span>
        <span class="number">{{name}}</span>
      </div>
    `);
  }
}
