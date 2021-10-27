import React from 'react';
import Notebook from 'brainstorm/Notebook';
import Note from 'brainstorm/Note';
import { drawLines } from "three/index";
import Edge from 'graph/Edge';
// import Immutable from 'immutable';
// import Mention from 'brainstorm/Mention';

type GraphProps = {

};

type GraphState = {
  selected: Note | null,
  _title: string,
  _content: string
};

/**
 * Graph.
 * @class
 */
class Graph extends React.Component<GraphProps, GraphState> {

  public _edges: any[] = [];

  public state: GraphState = {
    selected: null,
    _title: '',
    _content: ''
  };

  constructor (props: GraphProps) {
    super(props);
    // this.onUpdate = () => null;
    // this.notes = notes;
  }

  public saveEdge(event: React.SyntheticEvent) {
    event.preventDefault();
    const note = new Note(this.state._title, this.state._content);
    this.setState({
      selected: null,
      _title: '',
      _content: ''
    });
  }

  public hub(): JSX.Element {
    return (
      <div className="hub">
        <p>Notes: 0 dwdw</p>
      </div>
    );
  }

  public edges(): JSX.Element[] {
    this._edges = Notebook.notes.toSet().map((note: Note) => (
      <Edge
        key={ note.uuid }
        note={ note }
        selected={ note === this.state.selected }
        onSelect={ () => this.setState({ selected: note === this.state.selected ? null : note }) }
      />
    )).toArray();
    return this._edges;
  }

  public form(): JSX.Element {
     // onKeyDown="{ onKeyDownTitle }" placeholder="Title" onChange={ event => onTitleChange(event) }/>
     // onKeyDown={ onKeyDownContent } placeholder="Content" value={ content } onChange={ event => setContent(event.target.value) }></textarea>
    return (
      <form className="note-form" onSubmit={ this.saveEdge.bind(this) }>
        {/*<label className="placeholder">placeholder</label>*/}
        <input autoFocus value={ this.title } onChange={ event => this.updateTitle(event) } />
        <textarea rows={ 10 } value={ this.content } onChange={ event => this.update(event) } ></textarea>
        <button type="submit">add</button>
      </form>
    );
  }

  public updateTitle(event: any) {
    if (this.state.selected) this.setState({ selected: this.state.selected.update(event.target.value, this.content) });
    else this.setState({ _title: event.target.value })
  }

  public update(event: any) {
    if (this.state.selected) this.setState({ selected: this.state.selected.update(this.title, event.target.value) });
    else this.setState({ _content: event.target.value })
  }

  public get title(): string {
    return this.state.selected
      ? this.state.selected.title
      : this.state._title;
  }

  public get content(): string {
    return this.state.selected
      ? this.state.selected.content
      : this.state._content;
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
    // console.log(this._edges);
    this._edges.forEach(edge => drawLines(edge.props.note, edge.mesh));
  }
}

export default Graph;