import { useEffect, useState } from 'react';
import * as Three from 'three/index';
import Note from 'brainstorm/Note';
import createNode from 'three/createNode';

/*
* 
*/
interface TooltipProps {
  note: string,
  selected: boolean,
  onSelect: (t: string) => void
}

/*
* 
*/
function initTooltip (note: string) {
  // Three.drawDot(note, true);
  //const node = createNode(note);
  // return node;
}

/*
* 
*/
export default function Tooltip (props: TooltipProps) {
  const [mesh, setMesh] = useState<any>();
  useEffect(() => setMesh(initTooltip(props.note)), []);
  return (
    <label
      className={ ['node', props.selected ? 'selected' : '' ].join(' ') }
      onClick={ event => { event.stopPropagation(); props.onSelect(props.note)} }
      key={ props.note }
      id={ props.note }
    >
      { props.note }
      {/*<input onFocus={ event => this.props.onSelect(this, event) } className="ghosty"/>*/}
    </label>
  );
}
