import React from 'react';
import Materials from 'three/materials';
import scene from 'three/scene';
import createNode from 'three/createNode';
import Note from 'brainstorm/Note';
import { drawLines } from 'three/index';

type NodeProps = {
  note: Note,
  selected: boolean,
  drawLines: boolean,
  onSelect: (node: Node, event: any) => void
};

type NodeState = {
  note: Note
};

/**
 * Node.
 * @class
 */
class Node extends React.Component<NodeProps, NodeState> {
  /**
   * Return the notebook item.
   */
  public mesh: any;

  /**
   * Return the notebook item.
   */
  // public selected: boolean = false;

  /**
   * Return the notebook item.
   */
  // public state: NodeState;

  constructor (props: NodeProps) {
    super(props);
    this.state = {
      note: props.note
    };
    this.getMesh();
  }

  /**
   * Create the Three.js Object and add it to the scene.
   */
  public getMesh(): any {
    this.mesh = createNode(this.state.note);
    if (this.props.drawLines) drawLines(this.props.note, this.mesh, true);
  }

  /**
   * Create the Three.js Object and add it to the scene.
   */
  public update(title?: string|null, content?: string|null): Node {
    this.state.note.update(title, content);
    //this.drawLines();
    return this;
  }

  /**
   * Create the Three.js Object and add it to the scene.
   */
  public getClassName(selected: boolean): string {
    return `node${ selected ? ' selected': '' }`;
  }

  /**
   * Create the Three.js Object and add it to the scene.
   */
  public render(): JSX.Element {
      // tabIndex={index++}
      // contentEditable={'true'}
    return (
      <label
        className={ this.getClassName(this.props.selected) }
        onClick={ event => this.props.onSelect(this, event) }
        key={ this.state.note.uuid }
        id={ this.state.note.title }
      >
        { this.state.note.title }
        <input onFocus={ event => this.props.onSelect(this, event) } className="ghosty"/>
      </label>
    );
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public componentDidUpdate() {
    if (this.props.selected) this.highlight();
    else this.disparage();
  }

  /**
   * Highlight the three.js node mesh by changing the material on the mesh.
   * Materials.line.selected color is pure white.
   */
  highlight() {
    this.mesh.material = Materials.mesh.selected;
    const groupName = `${this.state.note.title}-mentions-tubes`;
    const tubes = scene.getObjectByName(groupName);
    if (!tubes) return;
    tubes.children.forEach((t: any) => (t.material = Materials.line.selected));
  }

  /**
   * Disparage the three.js node mesh by changing the material on the mesh.
   * Materials.line.default color is off white.
   */
  disparage() {
    this.mesh.material = Materials.mesh.default;
    const groupName = `${this.state.note.title}-mentions-tubes`;
    const tubes = scene.getObjectByName(groupName);
    if (!tubes) return;
    tubes.children.forEach((t: any) => (t.material = Materials.transparent));
  }
}

export default Node;