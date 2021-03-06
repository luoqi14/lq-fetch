import React, { Component } from 'react';
import { AutoComplete } from 'antd';
import PropTypes from 'prop-types';

export default class Input extends Component {
  static propTypes = {
    // value: PropTypes.string,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
  }

  constructor(props) {
    super(props);
    let value = props.value || undefined;
    if (typeof value === 'number') {
      value = `${value}`;
    }
    this.state = { value };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value || undefined;
      if (typeof value === 'number') {
        value = `${value}`;
      }
      this.setState({ value });
    }
  }

  handleChange(value) {
    this.props.onChange(value);
  }

  render() {
    const {
      disabled,
    } = this.props;

    return (
      <AutoComplete
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      >
        {
          disabled &&
            <input title={this.state.value} />
        }
      </AutoComplete>
    );
  }
}
