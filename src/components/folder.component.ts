import { BaseComponent } from './base.component';

export interface FolderComponentInput {
  id: string;
  name: string;
}

export class FolderComponent extends BaseComponent<FolderComponentInput> {

  constructor(input: FolderComponentInput) {
    super(input);

    this.template(`
      <div id="{{id}}" class="folder">{{name}}</div>
    `);
  }
}
