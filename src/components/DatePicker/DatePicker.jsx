import React, { Component } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

export default class DatePicker extends Component {
  static propTypes = {
    format: PropTypes.string,
  }

  static defaultProps = {
    format: 'YYYY-MM-DD',
    count: 60,
  }

  constructor(props) {
    super(props);
    let value = props.value || undefined;
    if (value) {
      value = moment(value);
    }
    this.state = { value };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value || undefined;
      if (value) {
        value = moment(value);
      }
      this.setState({ value });
    }
  }

  handleChange(value) {
    const time = value ? moment(value).format(this.props.format || 'YYYY-MM-DD') : value;
    this.props.onChange(time);
  }

  render() {
    return (
      <AntdDatePicker
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}
