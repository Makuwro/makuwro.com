import React from "react";
import styles from "../styles/Dropdown.module.css";
import PropTypes from "prop-types";

class Dropdown extends React.Component {
  
  constructor(props) {
    
    super(props);

    this.dropdownRef = React.createRef();
    this.checkIfFlipNeeded = this.checkIfFlipNeeded.bind(this);

    const children = React.Children.map(this.props.children, (child, index) => {

      const newProps = {
        ...child, 
        key: index, 
        onClick: () => {
    
          this.setState({option: child.props.children, open: false, above: false});
          if (this.props.onChange) this.props.onChange();
          
        }
      };
      newProps["$$typeof"] = undefined;
      return React.createElement(child.type, newProps, child.props.children);
  
    });

    this.state = {
      option: props.defaultOption || props.children[0].props.children,
      open: false,
      above: false,
      children: children
    };

  }

  checkIfFlipNeeded(open) {

    this.setState({open: true}, () => {

      const rect = this.dropdownRef.current.getBoundingClientRect();
      this.setState({above: rect.bottom > window.innerHeight, open: open});

    });

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
  defaultOption: PropTypes.string,
  children: PropTypes.any,
  onChange: PropTypes.func,
  width: PropTypes.number
};

export default Dropdown;