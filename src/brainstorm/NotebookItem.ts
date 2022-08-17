import uuid from '../common/uuid';

export default class NotebookItem {
  public uuid: string;
  constructor (_uuid?: string) {
    this.uuid = _uuid || uuid();
  }
}