import GraphObject from 'graph/GraphObject'
import Materials from 'three/materials';
import createNode from 'three/createNode';
import { default as ProxyNote } from 'brainstorm/proxy/Note';
import Note from 'brainstorm/Note';

/**
 * Edge.
 * @class
 */
class Edge extends GraphObject {
  /**
   * Return the notebook item.
   */
  public note: Note;

  constructor (title: string, content: string, _note?: Note) {
    const note = _note || new ProxyNote(title, content);
    super(note, createNode(note));
    this.note = note;
  }

  /**
   * Return the notebook item.
   */
  public static fromNote(note: Note): Edge {
    return new Edge('', '', note);
  }


  /**
   * Create the Three.js Object and add it to the scene.
   */
  public createMesh(): any {
    return {};
  }

  /**
   * Highlight the three.js edge mesh by changing the material on the mesh.
   * Materials.line.selected color is pure white.
   */
  highlight() {
    this.mesh.material = Materials.mesh.selected;
  }

  /**
   * Disparage the three.js edge mesh by changing the material on the mesh.
   * Materials.line.default color is off white.
   */
  disparage() {
    this.mesh.material = Materials.mesh.default;
  }
}

export default Edge;