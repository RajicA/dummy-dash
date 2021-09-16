import { BaseComponent } from './base.component';

export class GridItemComponent extends BaseComponent<unknown> {

  constructor() {
    super();

    this.template(`
      <div class="grid__item"><div>
    `);
  }
}
