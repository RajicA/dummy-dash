import { BaseComponent } from './base.component';

export class GridItemComponent extends BaseComponent {

  constructor() {
    super();

    this.template = `
      <section class="grid__item"><section>
    `;
  }
}
