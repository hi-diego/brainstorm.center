import { useEffect, useState } from 'react';
import Note from '../brainstorm/Note';

/*
* 
*/
interface TooltipProps {
  note: Note,
  selected: boolean,
  onSelect: () => any
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
  useEffect(() => setMesh(initTooltip(props.note.title)), []);
  return (
    <label
      className={ ['node', props.selected ? 'selected' : '' ].join(' ') }
      onClick={ event => { event.stopPropagation(); props.onSelect(); } }
      key={ props.note.title }
      id={ props.note.uuid }
    >
      { props.note.title }
      {/*<input onFocus={ event => this.props.onSelect(this, event) } className="ghosty"/>*/}
    </label>
  );
}
