import React from 'react';
import Materials from 'three/materials';
import createNode from 'three/createNode';
import Note from 'brainstorm/Note';

type NodeProps = {
  note: Note,
  selected: boolean,
  onSelect: () => void
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
    this.mesh = this.getMesh();
  }

  /**
   * Create the Three.js Object and add it to the scene.
   */
  public getMesh(): any {
    return createNode(this.state.note);
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
  public select() {
    // this.setState({ selected: true })
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
        onClick={ event => this.props.onSelect() }
        key={ this.state.note.uuid }
        id={ this.state.note.title }
      >
        { this.state.note.title }
        <input onFocus={ event => this.props.onSelect() } className="ghosty"/>
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
  }

  /**
   * Disparage the three.js node mesh by changing the material on the mesh.
   * Materials.line.default color is off white.
   */
  disparage() {
    this.mesh.material = Materials.mesh.default;
  }
}

export default Node;