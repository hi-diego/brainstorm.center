import uuid from 'common/uuid';

export default class NotebookItem {
  public uuid: string;
  public createdAt: Date;
  public modifiedAt: Date;
  constructor (_uuid?: string, createdAt?: Date, modified_at?: Date) {
    this.uuid = _uuid || uuid();
  	this.createdAt = createdAt || (new Date());
    this.modifiedAt = this.createdAt;
  }
}