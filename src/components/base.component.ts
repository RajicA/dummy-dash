import { buildElement } from '../utils/element-builder.utils';

export abstract class BaseComponent {

  private _element: HTMLElement;

  get element(): HTMLElement {
    return this._element;
  }

  set template(value: string) {
    this._element = buildElement(value);
  }
}
