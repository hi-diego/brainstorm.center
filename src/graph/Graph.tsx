import React from 'react';
import Immutable from 'immutable';
import Notebook from 'brainstorm/Notebook';
import Note from 'brainstorm/Note';
import { drawLines } from "three/index";
import Edge from 'graph/Edge';
// import Mention from 'brainstorm/Mention';

type GraphProps = {

};

type GraphState = {
  edges: Immutable.Map<string, Edge>,
  selected: Note | null
};

/**
 * Graph.
 * @class
 */
class Graph extends React.Component<GraphProps, GraphState> {

  public state: GraphState = {
    edges: Immutable.Map<string, Edge>(),
    selected: null
  };

  constructor (props: GraphProps) {
    super(props);
    new Note('foo', 'bar');
    new Note('bar', 'goo');
    // this.onUpdate = () => null;
    // this.notes = notes;
  }

  public saveEdge(event: React.SyntheticEvent) {
    event.preventDefault();
    console.log(event);
  }

  public hub(): JSX.Element {
    return (
      <div className="hub">
        <p>Notes: 0 dwdw</p>
      </div>
    );
  }

  public edges(): JSX.Element[] {
        // onClick={ this.setState({ selected: note }) }
    return Notebook.notes.toSet().map((note: Note) => (
      <Edge
        key={ note.uuid }
        note={ note }
        selected={ note === this.state.selected }
        onSelect={ () => this.setState({ selected: note === this.state.selected ? null : note }) }
      />
    )).toArray();
  }

  public form(): JSX.Element {
    return (
      <form className="note-form" onSubmit={ this.saveEdge }>
        {/*<label className="placeholder">placeholder</label>*/}
        {/*<input autoFocus value="{ title }" onKeyDown="{ onKeyDownTitle }"" placeholder="Title" onChange={ event => onTitleChange(event) }/>*/}
        {/*<textarea  rows={10} onKeyDown={onKeyDownContent} placeholder="Content" value={ content } onChange={ event => setContent(event.target.value) }></textarea>*/}
        <button type="submit">add</button>
      </form>
    );
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public render(): JSX.Element {
    return (
      <header className="App-header">
        { this.edges() }
        { this.hub() }
        { this.form() }
      </header>
    );
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public componentDidMount() {
    Notebook.notes.toSet().forEach(note => drawLines(note));
  }
}

export default Graph;