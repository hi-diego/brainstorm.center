import React, { useCallback }from 'react';
import { useHistory } from 'react-router-dom';
import Notebook from 'brainstorm/Notebook';
import Note from 'brainstorm/Note';
import Node from 'graph/Node';
import { drawLines } from 'three/index';
import Immutable from 'immutable';
import { init, clear } from "three/index";
import { Link } from "react-router-dom";

type GraphProps = {
  notebook?: string
};

type GraphState = {
  note: Note | null,
  title: string,
  content: string,
  componentDidMount: boolean,
  placeholder: string
};

const GRAPH = {
  SAVE_ASYNC: false,
  SAVE_SYNC: true,
  SAVE_BOUNCE_TIME: 2000
}

/**
 * Graph.
 * @class
 */
class Graph extends React.Component<GraphProps, GraphState> {

  public nodes: any[] = [];
  public timer: any; 

  public state: GraphState = {
    note: null,
    title: '',
    content: '',
    componentDidMount: false,
    placeholder: ''
  };

  constructor (props: GraphProps) {
    super(props);
    init();
    Notebook.load(props.notebook);
  }

  public save(flag: boolean = GRAPH.SAVE_SYNC, event?: React.SyntheticEvent|null) {
    if (event) event.preventDefault();
    window.clearTimeout(this.timer);
    if (flag === GRAPH.SAVE_ASYNC) this.timer = window.setTimeout(this._save.bind(this), GRAPH.SAVE_BOUNCE_TIME);
    else this._save();
  }

  public _save() {
    const note = this.state.note
      ? this.state.note.update(this.state.title, this.state.content)
      : new Note(this.state.title, this.state.content);
    this.setState({
      note: note,
      title: note.title,
      content: note.content
    });
    drawLines(note, null, true);
    // const node = this.nodes.find(node => node.props.note === note);
    // if (node) {
    //   console.log(node);
    //   // node.getMesh();
    // }
    return note;
  }

  public hub(): JSX.Element {
    return (
      <div className="hub">
        <p>Notes: { Notebook.notes.size }</p>
      </div>
    );
  }

  public getNodes(): JSX.Element[] {
    this.nodes = Notebook.notes.toSet().map((note: Note) => (
      <Node
        key={ note.uuid }
        note={ note }
        drawLines={ this.state.componentDidMount }
        selected={ note === this.state.note }
        onSelect={ event => this.select.bind(this)(note, event) }
      />
    )).toArray();
    return this.nodes;
  }

  public select (note: Note, event: any = null) {
    this.setState({
      note: note,
      title: note.title,
      content: note.content
    });
  }

  public form(): JSX.Element {
     // onKeyDown="{ onKeyDownTitle }" placeholder="Title" onChange={ event => onTitleChange(event) }/>
     // onKeyDown={ onKeyDownContent } placeholder="Content" value={ content } onChange={ event => setContent(event.target.value) }></textarea>
    return (
      <form className="note-form" onSubmit={ event => this.save.bind(this)(GRAPH.SAVE_SYNC, event) }>
        <label className="placeholder">{ this.state.placeholder }</label>
        <input autoFocus placeholder="Title" onKeyDown={ this.onTitleKeyDown.bind(this) } value={ this.state.title } onChange={ event => this.updateTitle(event) } />
        <textarea placeholder="Content" onKeyDown={ this.onContentKeyDown.bind(this) } rows={ 10 } value={ this.state.content } onChange={ event => this.update(null, event.target.value) } ></textarea>
        {/*<button onClick={ event => useCallback(() => history.push('/sample'), [history]) }>go</button>*/}
        { this.state.note &&  <Link to={ this.state.note.title }>GO</Link> }
      </form>
    );
  }

  public onTitleKeyDown(event: any) {
    if (event.key === 'Enter') return this.save();
    if (event.key === 'ArrowRight' && this.state.placeholder) {
      const note = Notebook.notes.get(this.state.placeholder); 
      if (note) this.select(note);
    }
  }

  public searchNodes(newTitle: string): string {
    return newTitle && Notebook.notes.keySeq().filter((k: string) => k.startsWith(newTitle)).toArray()[0];
  }

  public onContentKeyDown(event: any) {
    if (event.key === 'Enter') return this.save();
  }

  public updateTitle(event: any) {
    const title = event.target.value;
    const placeholder = this.searchNodes(title);
    this.update(title);
    this.setState({ placeholder: placeholder });
    this.save(GRAPH.SAVE_ASYNC);
  }

  public update(title?: string|null, content?: string|null) {
    if (title) this.setState({ title });
    if (content) this.setState({ content });
    this.save(GRAPH.SAVE_ASYNC);
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public render(): JSX.Element {
    return (
      <header className="App-header">
        { this.getNodes() }
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
    this.nodes.forEach(node => drawLines(node.props.note, node.mesh));
    this.setState({ componentDidMount: true });
    const canvas = document.getElementById('three-canvas');
    if (canvas) canvas.onclick = () => this.setState({ note: null, title: '', content: '' });
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public componentDidUpdate(prevProps: GraphProps) {
    console.log(this.props.notebook, prevProps.notebook);
    if (this.props.notebook !== prevProps.notebook) {
      this.onRouteChanged(this.props.notebook);
    }
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public onRouteChanged(notebook?: string) {
    Notebook.reload(notebook);
    clear();
    this.initState();
  }

  /**
   * Add or Update the given note to the notebook:
   * this will recalculate all the mentionses as well.
   */
  public initState(notebook?: string) {
    this.setState({
      note: null,
      title: '',
      content: '',
      // componentDidMount: false,
      placeholder: ''
    });
    this.getNodes();
    // window.setTimeout(() => this.setState(({ componentDidMount: true })), 1000)
  }
}

export default Graph;