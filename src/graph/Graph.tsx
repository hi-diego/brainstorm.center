import React from 'react';
import Notebook from 'brainstorm/Notebook';
import Note from 'brainstorm/Note';
import Node from 'graph/Node';
import { drawLines } from 'three/index';
import Immutable from 'immutable';
// import Mention from 'brainstorm/Mention';

type GraphProps = {

};

type GraphState = {
  selected: Note | null,
  _title: string,
  _content: string,
  componentDidMount: boolean,
  placeholder: string
};

/**
 * Graph.
 * @class
 */
class Graph extends React.Component<GraphProps, GraphState> {

  public _nodes: any[] = [];

  public state: GraphState = {
    selected: null,
    _title: '',
    _content: '',
    componentDidMount: false,
    placeholder: ''
  };

  constructor (props: GraphProps) {
    super(props);
    // this.onUpdate = () => null;
    // this.notes = notes;
  }

  public saveNode(event?: React.SyntheticEvent) {
    if (event) event.preventDefault();
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

  public nodes(): JSX.Element[] {
    this._nodes = Notebook.notes.toSet().map((note: Note) => (
      <Node
        key={ note.uuid }
        note={ note }
        drawLines={ this.state.componentDidMount }
        selected={ note === this.state.selected }
        onSelect={ () => this.setState({ selected: note === this.state.selected ? null : note }) }
      />
    )).toArray();
    return this._nodes;
  }

  public form(): JSX.Element {
     // onKeyDown="{ onKeyDownTitle }" placeholder="Title" onChange={ event => onTitleChange(event) }/>
     // onKeyDown={ onKeyDownContent } placeholder="Content" value={ content } onChange={ event => setContent(event.target.value) }></textarea>
    return (
      <form className="note-form" onSubmit={ this.saveNode.bind(this) }>
        <label className="placeholder">{ this.state.placeholder }</label>
        <input autoFocus placeholder="Title" onKeyDown={ this.onKeyDownTitle.bind(this) } value={ this.title } onChange={ event => this.updateTitle(event) } />
        <textarea placeholder="Content" onKeyDown={ this.onKeyDown.bind(this) } rows={ 10 } value={ this.content } onChange={ event => this.update(event) } ></textarea>
        {/*<button type="submit">add</button>*/}
      </form>
    );
  }

  public onKeyDownTitle(event: any) {
    console.log('onKeyDownTitle');
    if (event.key === 'Tab' && this.state.placeholder) {
      this.setState({
        selected: Notebook.notes.get(this.state.placeholder) || null,
        // placeholder: ''
      });
    }
  }

  public searchNodes(newTitle: string): string {
    return newTitle && Notebook.notes.keySeq().filter((k: string) => k.startsWith(newTitle)).toArray()[0];
  }

  public onKeyDown(event: any) {
    if (event.key === 'Enter') this.saveNode();
  }

  public updateTitle(event: any) {
    const newTitle = event.target.value;
    const newPlaceholder = this.searchNodes(newTitle);
    this.setState({ placeholder: newPlaceholder });
    if (this.state.selected) this.setState({ selected: this.state.selected.update(newTitle, this.content) });
    else this.setState({ _title: newTitle });
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
        { this.nodes() }
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
    this._nodes.forEach(node => drawLines(node.props.note, node.mesh));
    this.setState({ componentDidMount: true });
    const canvas = document.getElementById('three-canvas');
    if (canvas) canvas.onclick = () => this.setState({ selected: null });
  }
}

export default Graph;