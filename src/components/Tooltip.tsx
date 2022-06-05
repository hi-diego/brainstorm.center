import { useEffect, useState } from 'react';
import * as Three from 'three/index';
import Note from 'brainstorm/Note';
import createNode from 'three/createNode';

/*
* 
*/
interface TooltipProps {
  note: Note,
  selected: boolean,
  onSelect: (t: string) => void
}

/*
* 
*/
function initTooltip (note: Note) {
  // Three.drawDot(note, true);
  const node = createNode(note);
  return node;
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
      onClick={ () => props.onSelect(props.note.title) }
      key={ props.note.title }
      id={ props.note.title }
    >
      { props.note.title }
      {/*<input onFocus={ event => this.props.onSelect(this, event) } className="ghosty"/>*/}
    </label>
  );
}
