import NotebookItem from 'brainstorm/NotebookItem'
import IGraphObject from 'graph/IGraphObject'

export default class GraphObject implements IGraphObject {
  public item: NotebookItem;
  public mesh: any;

  constructor (item: NotebookItem, mesh: any) {
    this.item = item;
    this.mesh = mesh;
  }
}