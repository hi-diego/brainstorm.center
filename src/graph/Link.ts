import GraphObject from 'graph/GraphObject'
import Mention from 'brainstorm/Mention';
import Materials from 'three/materials';

/**
 * Link.
 * @class
 */
class Link extends GraphObject {

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
   * Highlight the three.js node mesh by changing the material on the mesh.
   * Materials.line.selected color is pure white.
   */
  highlight() {
    this.mesh.material = Materials.line.selected;
  }

  /**
   * Disparage the three.js node mesh by changing the material on the mesh.
   * Materials.line.default color is off white.
   */
  disparage() {
    this.mesh.material = Materials.line.default;
  }
}

export default Link;