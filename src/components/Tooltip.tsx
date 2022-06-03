
interface TooltipProps {
  title: string
}

export default function Tooltip (props: TooltipProps) {
  return (
    <label
      className="node"
      onClick={ event => null }
      key={ props.title }
      id={ props.title }
    >
      { props.title }
      {/*<input onFocus={ event => this.props.onSelect(this, event) } className="ghosty"/>*/}
    </label>
  );
}
