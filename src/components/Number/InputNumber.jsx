import React, { Component } from 'react';
import { InputNumber as AntdInputNumber } from 'antd';
import PropTypes from 'prop-types';

function formatMoney(num) {
  const numStr = `${num}`;
  const nums = numStr.split('.');

  const integer = (nums[0]).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return nums.length > 1 ? `${integer}.${nums[1]}` : integer;
}

export default class InputNumber extends Component {
  static propTypes = {
    max: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    money: PropTypes.bool,
    min: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    max: 10000000000000000,
    min: -Infinity,
    money: false,
    placeholder: '',
    disabled: false,
  }

  constructor(props) {
    super(props);
    const value = typeof (props.value) === 'number' ? (props.value) : (props.value || undefined);
    this.state = { value };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = typeof (nextProps.value) === 'number' ? (nextProps.value) : (nextProps.value || undefined);
      this.setState({ value });
    }
  }

  handleChange(value) {
    this.props.onChange(`${value}`);
  }

  formatter = (val) => {
    let value = val;
    if (value) {
      value = (`${value}`).replace(/[^.\-\d]/g, '');
      let precision = 0;
      const valueStr = `${value}`;
      const index = valueStr.indexOf('.');
      if (index >= 0) {
        precision = valueStr.length - valueStr.indexOf('.') - 1;
      }
      if (precision > 2) {
        value = (`${value}`).slice(0, index + 3);
      }
    }
    value = (`${value}`).replace(/,/g, '');
    return value;
  }

  render() {
    const {
      money,
      max = 10000000000000000,
      min,
      placeholder,
      disabled,
    } = this.props;

    return (
      <AntdInputNumber
        disabled={disabled}
        max={+max}
        min={(typeof min === 'number' ? min : +min) || undefined}
        placeholder={placeholder}
        money={money}
        onChange={this.handleChange.bind(this)}
        value={this.state.value}
        formatter={(val) => {
          const value = this.formatter(val);
          return money ? formatMoney(value) : value;
        }}
        parser={(val) => (this.formatter(val))}
      />
    );
  }
}
