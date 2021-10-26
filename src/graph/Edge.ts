import GraphObject from 'graph/GraphObject'
import Note from 'brainstorm/Note';
import Materials from 'three/materials';

/**
 * Edge.
 * @class
 */
class Edge extends GraphObject {

  constructor (note: Note, mesh: any) {
    super(note, mesh);
  }

  /**
   * Return the notebook item.
   */
  public get note() {
    return this.item;
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