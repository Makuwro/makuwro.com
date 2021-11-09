import React from "react";
import styles from "../styles/Dropdown.module.css";
import PropTypes from "prop-types";

class Dropdown extends React.Component {
  
  constructor(props) {
    
    super(props);

    this.dropdownRef = React.createRef();
    this.checkIfFlipNeeded = this.checkIfFlipNeeded.bind(this);
    this.refresh = this.refresh.bind(this);

    this.state = {
      option: null,
      open: false,
      above: false,
      children: null,
      index: props.index || 0
    };

  }

  checkIfFlipNeeded(open) {

    this.setState({open: true}, () => {

      const rect = this.dropdownRef.current.getBoundingClientRect();
      this.setState({above: rect.bottom > window.innerHeight, open: open});

    });

  }

  refresh() {

    this.setState({children: React.Children.map(this.props.children, (child, index) => {

      if (index === this.state.index) this.setState({option: child.props.children});

      const newProps = {
        ...child,
        props: undefined,
        _owner: undefined,
        _store: undefined,
        type: undefined,
        key: index,
        className: this.state.index === index ? styles.selected : null,
        onClick: () => {
    
          this.setState({option: child.props.children, index: index, open: false, above: false}, () => this.props.onChange && this.props.onChange(index));
          
        }
      };
      newProps["$$typeof"] = undefined;
      return React.createElement(child.type, newProps, child.props.children);
  
    })});

  }

  componentDidMount() {

    this.refresh();

  }

  componentDidUpdate(oldProps, oldState) {

    if (this.props.index !== oldProps.index) this.setState({index: this.props.index});
    if (this.state.index !== oldState.index) this.refresh();

  }

  render() {

    return (
      <section className={`${styles.list} ${!this.state.open ? styles.closed : ""} ${this.state.above ? styles.above : ""}`}>
        <section style={{width: this.props.width || "auto"}} onClick={() => this.checkIfFlipNeeded(!this.state.open)}>{this.state.option}</section>
        <ul ref={this.dropdownRef}>{this.state.children}</ul>
      </section>
    );

  }

}

Dropdown.propTypes = {
  option: PropTypes.string,
  children: PropTypes.any,
  onChange: PropTypes.func,
  width: PropTypes.number
};

export default Dropdown;