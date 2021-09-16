import { buildElement } from '../utils/element-builder.utils';

export abstract class BaseComponent<T> {

  private input: T;

  private _element: HTMLElement;
  get element(): HTMLElement {
    return this._element;
  }

  constructor(input?: T) {
    this.input = input;
  }

  protected template(value: string): void {
    this._element = buildElement<T>(value, this.input);
  }
}
