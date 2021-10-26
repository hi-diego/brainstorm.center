import GraphObject from 'graph/GraphObject'
import Mention from 'brainstorm/Mention';
import Materials from 'three/materials';

/**
 * Vertex.
 * @class
 */
class Vertex extends GraphObject {

  constructor (mention: Mention, mesh: any) {
    super(mention, mesh);
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
    this.mesh.material = Materials.line.selected;
  }

  /**
   * Disparage the three.js edge mesh by changing the material on the mesh.
   * Materials.line.default color is off white.
   */
  disparage() {
    this.mesh.material = Materials.line.default;
  }
}

export default Vertex;