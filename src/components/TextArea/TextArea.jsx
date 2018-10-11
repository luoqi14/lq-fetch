import React, { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import './style.scss';

const AntdTextArea = Input.TextArea;

export default class TextArea extends Component {
  static propTypes = {
    max: PropTypes.number,
  }

  static defaultProps = {
    max: undefined,
  }
  constructor(props) {
    super(props);
    let value = props.value || undefined;
    if (typeof value === 'number') {
      value = `${value}`;
    }
    this.state = { value, cur: 0 };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value || undefined;
      if (typeof value === 'number') {
        value = `${value}`;
      }
      const cur = (value || '').length;
      this.setState({ value, cur });
    }
  }

  handleChange(value) {
    this.props.onChange(value);
  }

  render() {
    const {
      disabled,
      max,
    } = this.props;
    const {
      value,
      cur,
    } = this.state;
    const numVisible = max && !disabled;
    return (
      <div>
        <AntdTextArea
          {...this.props}
          value={value}
          onChange={this.handleChange.bind(this)}
        />
        <div className="ant-textarea-num" style={{ display: !numVisible ? 'none' : 'block' }}>
          <span className="ant-textarea-num-pre">{cur}</span>
           /
          <span className="ant-textarea-num-post">{max}</span>
        </div>
      </div>
    );
  }
}
